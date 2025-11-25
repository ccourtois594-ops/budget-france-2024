import { GoogleGenAI } from "@google/genai";
import { budget2024, getBudgetSummary } from "../data/budget2024";

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToGemini = async (message: string, history: { role: string; parts: { text: string }[] }[] = []) => {
  if (!ai) {
    throw new Error("API Key is missing. Please configure the environment variable API_KEY.");
  }

  const modelId = "gemini-2.5-flash"; // Optimized for speed/cost for this use case

  const systemContext = `
    Tu es un expert en finances publiques françaises. Tu dois analyser le Budget de l'État 2024.
    Voici les données brutes du graphe Sankey (en Milliards d'Euros):
    ${JSON.stringify(budget2024)}
    
    Résumé contextuel: ${getBudgetSummary()}

    Règles:
    1. Réponds de manière précise aux questions sur les montants.
    2. Si on te demande "Pourquoi la dette est élevée ?", explique le contexte du déficit structurel et de la montée des taux.
    3. Sois concis et pédagogique.
    4. Formate tes réponses en Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: message,
      config: {
        systemInstruction: systemContext,
        temperature: 0.3, // Lower temperature for more factual answers
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je ne peux pas accéder aux données budgétaires pour le moment. Vérifiez votre clé API.";
  }
};
