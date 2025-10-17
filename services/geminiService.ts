
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getAiAssistance(prompt: string, documentContext: string): Promise<string> {
    try {
        const fullPrompt = `
        Du er KAI, en AI-lærer for en 6. klassing. Målet ditt er å hjelpe eleven med å lære ved å veilede dem, ikke ved å gi dem det direkte svaret.
        Når eleven stiller et spørsmål, svar med hint, ledende spørsmål eller forslag som oppmuntrer dem til å tenke selv. Vær oppmuntrende og støttende.
        Svar KUN på norsk, med mindre eleven eksplisitt ber deg om å bruke et annet språk.

        Her er konteksten fra elevens nåværende notat:
        ---
        ${documentContext}
        ---

        Her er elevens spørsmål til deg: "${prompt}"

        Svaret ditt skal veilede eleven mot svaret uten å gi det bort.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching AI assistance:", error);
        if (error instanceof Error) {
            return `Beklager, jeg støtte på en feil: ${error.message}`;
        }
        return "Beklager, jeg støtte på en ukjent feil.";
    }
}
