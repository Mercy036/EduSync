import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not defined" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { totalHours, subjects } = body;

    // --- STEP 1: DYNAMICALLY FIND A WORKING MODEL ---
    // We ask the API what models are actually available for your key
    const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const modelsResponse = await fetch(modelsUrl);
    
    if (!modelsResponse.ok) {
        throw new Error(`Failed to list models: ${modelsResponse.statusText}`);
    }
    
    const modelsData = await modelsResponse.json();
    const availableModels = modelsData.models || [];

    // Filter for models that support 'generateContent'
    const contentModels = availableModels.filter((m: any) => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes("generateContent")
    );

    if (contentModels.length === 0) {
        throw new Error("No text-generation models available for this API key.");
    }

    // Smart Selection: Prefer Flash > Pro > Any
    let selectedModel = contentModels.find((m: any) => m.name.includes("flash"));
    if (!selectedModel) {
        selectedModel = contentModels.find((m: any) => m.name.includes("pro"));
    }
    if (!selectedModel) {
        selectedModel = contentModels[0]; // Fallback to first available
    }

    console.log(`Auto-selected model: ${selectedModel.name}`);

    // --- STEP 2: GENERATE CONTENT ---
    
    const promptText = `
      Act as an expert academic planner. Create a weekly study timetable.
      
      Constraints:
      - Total Weekly Hours: ${totalHours}
      - Subjects: ${JSON.stringify(subjects)}
      
      Instructions:
      1. Distribute hours across 7 days.
      2. Respect 'minHours' for each subject.
      3. Prioritize 'Critical' importance.
      4. Schedule 'Hate' preference subjects earlier in the day.
      5. Provide a 'focus_topic' suggestion.

      CRITICAL OUTPUT FORMAT:
      You must output ONLY valid JSON. Do not include markdown formatting (like \`\`\`json). 
      The JSON structure must exactly match this example:
      {
        "strategy_summary": "Explanation of how the plan was built...",
        "schedule": [
          {
            "day": "Monday",
            "total_hours": 4,
            "sessions": [
              {
                "time_slot": "09:00 - 10:00",
                "subject": "Math",
                "focus_topic": "Algebra",
                "duration_mins": 60
              }
            ]
          }
        ]
      }
    `;

    // Note: selectedModel.name usually comes as 'models/gemini-1.5-flash', so we just append :generateContent
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel.name}:generateContent?key=${apiKey}`;

    const response = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7 }, // No strict JSON mode to ensure compatibility
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini Generation Error:", JSON.stringify(errorData, null, 2));
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) throw new Error("No text returned from Gemini API");

    // Clean Markdown
    generatedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsedData = JSON.parse(generatedText);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Timetable Generation Failed:", error);
    return NextResponse.json(
      { error: "Failed to generate timetable. Check console for details." },
      { status: 500 }
    );
  }
}