import os
import time
import uuid
import tempfile
import shutil
from datetime import datetime
from typing import List, Optional
from pathlib import Path
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl

from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq

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

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
QDRANT_API_KEY = os.getenv("qdrantclientapikey")

gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
COLLECTION_NAME = "rag_documents"

qdrant_client = QdrantClient(
    url="https://b33de8cb-0cc4-4400-b1bf-9689ec74812f.sa-east-1-0.aws.cloud.qdrant.io",
    api_key=QDRANT_API_KEY,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        collections = qdrant_client.get_collections()
        names = [c.name for c in collections.collections]
        if COLLECTION_NAME not in names:
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=768, distance=Distance.COSINE),
            )
    except Exception as e:
        print(f"Startup error: {e}")
    yield

app = FastAPI(title="RAG Backend API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})

class URLInput(BaseModel):
    urls: List[HttpUrl]

class QueryInput(BaseModel):
    question: str
    top_k: Optional[int] = 4
    source_type: Optional[str] = None

class Response(BaseModel):
    answer: str
    sources: List[dict]

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

def get_embeddings_batch(texts: List[str]):
    res = gemini_client.models.embed_content(
        model="models/text-embedding-004",
        contents=texts
    )
    return [e.values for e in res.embeddings]

def store_in_qdrant(docs, source_type: str, source_name: str):
    chunks = text_splitter.split_documents(docs)
    texts = [c.page_content for c in chunks]
    all_embeddings = []
    for i in range(0, len(texts), 15):
        batch = texts[i : i + 15]
        all_embeddings.extend(get_embeddings_batch(batch))
        time.sleep(1)
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=emb,
            payload={
                "text": chunk.page_content,
                "source_type": source_type,
                "source_name": source_name,
                "timestamp": datetime.utcnow().isoformat()
            }
        ) for chunk, emb in zip(chunks, all_embeddings)
    ]
    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
    return len(chunks)

@app.get("/")
async def root():
    return {"status": "healthy"}

@app.post("/load-pdf")
async def load_pdf(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        path = tmp.name
    try:
        loader = PyPDFLoader(path)
        count = store_in_qdrant(loader.load(), "pdf", file.filename)
        return {"chunks_added": count}
    finally:
        if os.path.exists(path):
            os.remove(path)

@app.post("/query", response_model=Response)
async def query(query_input: QueryInput):
    emb = get_embeddings_batch([query_input.question])[0]
    results = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=emb,
        limit=query_input.top_k
    )
    if not results:
        return Response(answer="No documents found.", sources=[])
    llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.3-70b-versatile")
    context = "\n\n".join(r.payload["text"] for r in results)
    ans = llm.invoke(f"Context: {context}\n\nQuestion: {query_input.question}").content
    return Response(
        answer=ans,
        sources=[{"name": r.payload["source_name"], "score": r.score} for r in results]
    )

@app.delete("/reset")
async def reset():
    qdrant_client.delete_collection(COLLECTION_NAME)
    qdrant_client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    )
    return {"status": "reset"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
