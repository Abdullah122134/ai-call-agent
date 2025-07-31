import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateResponse(message: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
  try {
    // Prepare conversation context
    const context = conversationHistory.length > 0 
      ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n'
      : '';
    
    const prompt = `You are a helpful AI assistant having a voice conversation. Keep responses conversational, clear, and concise since they will be spoken aloud. Avoid overly long responses.

${context}user: ${message}
assistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: "Hello, this is a test message.",
    });
    return !!response.text;
  } catch (error) {
    console.error("Gemini connection test failed:", error);
    return false;
  }
}
