from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import os
import tempfile
import shutil
from pathlib import Path
import uuid
from datetime import datetime

from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from google import genai

app = FastAPI(title="RAG Backend API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
QDRANT_API_KEY = os.getenv("qdrantclientapikey")

qdrant_client = QdrantClient(
    url="https://b33de8cb-0cc4-4400-b1bf-9689ec74812f.sa-east-1-0.aws.cloud.qdrant.io",
    api_key=QDRANT_API_KEY,
)

gemini_client = genai.Client(api_key=GOOGLE_API_KEY)

COLLECTION_NAME = "rag_documents"

class URLInput(BaseModel):
    urls: List[HttpUrl]

class QueryInput(BaseModel):
    question: str
    top_k: Optional[int] = 4
    source_type: Optional[str] = None

class Response(BaseModel):
    answer: str
    sources: List[dict]

class DocumentStats(BaseModel):
    total_documents: int
    pdf_documents: int
    web_documents: int

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)

def ensure_payload_indexes():
    qdrant_client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="source_type",
        field_schema="keyword",
    )

def initialize_collection():
    collections = qdrant_client.get_collections()
    names = [c.name for c in collections.collections]

    if COLLECTION_NAME not in names:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=3072,
                distance=Distance.COSINE,
            ),
        )

    ensure_payload_indexes()

def get_embedding(text: str) -> List[float]:
    result = gemini_client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values

def store_documents_in_qdrant(documents, source_type: str, source_name: str):
    chunks = text_splitter.split_documents(documents)
    points = []

    for idx, chunk in enumerate(chunks):
        embedding = get_embedding(chunk.page_content)

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": chunk.page_content,
                    "source_type": source_type,
                    "source_name": source_name,
                    "chunk_index": idx,
                    "timestamp": datetime.utcnow().isoformat(),
                    "metadata": chunk.metadata,
                },
            )
        )

    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    return len(chunks)

def search_similar_documents(query: str, top_k: int, source_type: Optional[str]):
    query_embedding = get_embedding(query)

    search_filter = None
    if source_type:
        search_filter = Filter(
            must=[
                FieldCondition(
                    key="source_type",
                    match=MatchValue(value=source_type),
                )
            ]
        )

    return qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=top_k,
        query_filter=search_filter,
    )

def generate_answer(question: str, context_docs):
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name="groq/compound-mini",
        temperature=0.2,
    )

    context = "\n\n".join(doc.payload["text"] for doc in context_docs)

    prompt = f"""
Use the following context to answer the question.
If the answer is not in the context, say you don't know.

Context:
{context}

Question:
{question}

Answer:
"""

    response = llm.invoke(prompt)
    return response.content

@app.on_event("startup")
async def startup_event():
    initialize_collection()

@app.get("/")
async def root():
    collections = qdrant_client.get_collections()
    return {
        "status": "healthy",
        "collection_exists": COLLECTION_NAME
        in [c.name for c in collections.collections],
    }

@app.post("/load-urls")
async def load_urls(url_input: URLInput):
    total_chunks = 0

    for url in url_input.urls:
        loader = WebBaseLoader(str(url))
        docs = loader.load()

        total_chunks += store_documents_in_qdrant(
            documents=docs,
            source_type="web",
            source_name=str(url),
        )

    return {"chunks_added": total_chunks}

@app.post("/load-pdf")
async def load_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF supported")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        path = tmp.name

    try:
        loader = PyPDFLoader(path)
        docs = loader.load()

        chunks = store_documents_in_qdrant(
            documents=docs,
            source_type="pdf",
            source_name=file.filename,
        )

        return {"chunks_added": chunks}

    finally:
        Path(path).unlink(missing_ok=True)

@app.post("/query", response_model=Response)
async def query(query_input: QueryInput):
    results = search_similar_documents(
        query=query_input.question,
        top_k=query_input.top_k,
        source_type=query_input.source_type,
    )

    if not results:
        return Response(answer="No relevant documents found.", sources=[])

    answer = generate_answer(query_input.question, results)

    sources = []
    seen = set()

    for r in results:
        key = f"{r.payload['source_type']}:{r.payload['source_name']}"
        if key not in seen:
            sources.append(
                {
                    "type": r.payload["source_type"],
                    "name": r.payload["source_name"],
                    "score": r.score,
                }
            )
            seen.add(key)

    return Response(answer=answer, sources=sources)

@app.delete("/reset")
async def reset_collection():
    qdrant_client.delete_collection(COLLECTION_NAME)
    initialize_collection()
    return {"status": "collection reset"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
