import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import { NextResponse } from "next/server"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const schema = {
    type: SchemaType.OBJECT,
    properties: {
        summary: { type: SchemaType.STRING },
        timestamps: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    time: { type: SchemaType.STRING },
                    label: { type: SchemaType.STRING },
                },
                required: ["time", "label"],
            },
        },
    },
    required: ["summary", "timestamps"],
}


export async function POST(req: Request) {
    try {
        const { videoURL } = await req.json();
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }as any,
        });

        const prompt = `Generate a summary and timestamps for this video: ${videoURL}`;
        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })

    }
}