

import { GoogleGenAI, Type } from "@google/genai";
import { Note, Objective, GroupGame } from '../data/content';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface LessonPlan {
    objectives: string[];
    activities: string[];
    assessment: string;
}

export interface Feedback {
    positives: string[];
    improvements: string[];
    questions: string[];
}

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

export async function generateLessonPlan(subject: string, topic: string, numLessons: number): Promise<LessonPlan> {
    try {
        const prompt = `Lag en leksjonsplan for faget "${subject}" om temaet "${topic}". Planen skal strekke seg over ${numLessons} leksjon(er). Inkluder læringsmål, aktiviteter, og en vurderingsmetode. Svar på norsk.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        objectives: {
                            type: Type.ARRAY,
                            description: "En liste med 3-5 læringsmål for leksjonen(e).",
                            items: { type: Type.STRING }
                        },
                        activities: {
                            type: Type.ARRAY,
                            description: "En liste med aktiviteter elevene skal gjennomføre.",
                            items: { type: Type.STRING }
                        },
                        assessment: {
                            type: Type.STRING,
                            description: "En kort beskrivelse av hvordan elevenes forståelse skal vurderes."
                        }
                    },
                    required: ['objectives', 'activities', 'assessment']
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as LessonPlan;
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        throw new Error("Kunne ikke generere leksjonsplanen.");
    }
}


export async function getFeedbackSuggestions(noteContent: string): Promise<Feedback> {
    try {
        const prompt = `
        Du er en erfaren lærer som gir tilbakemelding på et notat skrevet av en elev på 6. trinn.
        Vær konstruktiv, oppmuntrende og hjelpsom. Gi konkrete forslag. Svar på norsk.
        
        Her er elevens tekst:
        ---
        ${noteContent}
        ---
        
        Gi tilbakemelding strukturert med:
        1. Positive poenger (hva eleven gjorde bra).
        2. Forbedringspunkter (hva som kan gjøres bedre).
        3. Ledende spørsmål (spørsmål for å få eleven til å tenke videre).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        positives: {
                            type: Type.ARRAY,
                            description: "En liste over positive aspekter ved teksten.",
                            items: { type: Type.STRING }
                        },
                        improvements: {
                            type: Type.ARRAY,
                            description: "En liste over konkrete forbedringspunkter.",
                            items: { type: Type.STRING }
                        },
                        questions: {
                            type: Type.ARRAY,
                            description: "En liste med 2-3 ledende spørsmål for å fremme refleksjon.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['positives', 'improvements', 'questions']
                },
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as Feedback;
    } catch (error) {
        console.error("Error generating feedback:", error);
        throw new Error("Kunne ikke generere tilbakemelding.");
    }
}

export async function generateAdaptiveGame(
  subject: string,
  notes: Note[],
  objectives: Objective[]
): Promise<GroupGame> {
  try {
    const notesContext = notes.map(n => `Tittel: ${n.title}\nInnhold: ${n.studentAnswer}`).join('\n---\n');
    const objectivesContext = objectives.map(o => `- ${o.text}`).join('\n');

    const prompt = `
    Du er en kreativ pedagogisk spillutvikler for 6. klassinger.
    Din oppgave er å lage et personlig og lærerikt spill basert på en elevs notater og fagets læringsmål.

    **Analysegrunnlag:**

    **1. Elevens Notater (Fag: ${subject}):**
    ---
    ${notesContext}
    ---

    **2. Læringsmål for faget:**
    ---
    ${objectivesContext}
    ---

    **Din Oppgave:**
    1.  **Analyser** notatene. Identifiser nøkkelkonsepter eleven har jobbet med. Se etter områder der eleven kan virke usikker eller har misforståelser. Vurder elevens generelle kunnskapsnivå og skrivestil.
    2.  **Sammenlign** med læringsmålene. Finn ut hvilke læringsmål som er godt dekket, og hvilke som trenger mer øving.
    3.  **Design et spill** med 3 steg (spørsmål/gåter) som er skreddersydd for denne eleven. Spillet skal:
        *   Hjelpe eleven med å styrke svake områder.
        *   Utfordre dem til å tenke dypere rundt temaer de allerede har berørt.
        *   Være engasjerende, morsomt og passende for en 12-åring.
        *   Ha en kreativ og fengende tittel.
    4.  Svaret ditt **MÅ** være et gyldig JSON-objekt som følger det gitte skjemaet.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "En kreativ og passende tittel for det genererte spillet."
                    },
                    steps: {
                        type: Type.ARRAY,
                        description: "En liste med nøyaktig 3 steg. Hvert steg er et objekt med en 'clue' (gåte/spørsmål) og et 'answer' (svar).",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                clue: { type: Type.STRING },
                                answer: { type: Type.STRING }
                            },
                            required: ['clue', 'answer']
                        }
                    }
                },
                required: ['title', 'steps']
            },
        },
    });

    const jsonStr = response.text.trim();
    const parsedResponse = JSON.parse(jsonStr) as { title: string; steps: { clue: string; answer: string }[] };
    
    if (parsedResponse.steps.length !== 3) {
      throw new Error("AI generated a game with an incorrect number of steps.");
    }

    const newGame: GroupGame = {
      id: `ai-game-${Date.now()}`,
      title: parsedResponse.title,
      subject: subject,
      steps: parsedResponse.steps.map((step, index) => ({
        id: `ai-step-${index}-${Date.now()}`,
        clue: step.clue,
        answer: step.answer
      })),
      isAiGenerated: true
    };

    return newGame;
  } catch (error) {
    console.error("Error generating adaptive game:", error);
    throw new Error("Kunne ikke lage et personlig spill. Prøv igjen senere.");
  }
}

export async function recognizeHandwriting(imageDataUrl: string): Promise<string> {
    if (!imageDataUrl.startsWith('data:image/png;base64,')) {
        throw new Error("Invalid image data URL format.");
    }
    
    const base64Data = imageDataUrl.substring('data:image/png;base64,'.length);

    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Data,
            },
        };
        const textPart = {
            text: "Transcribe the handwriting from this image. Only return the transcribed text. Do not add any formatting like markdown."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error recognizing handwriting:", error);
        throw new Error("Kunne ikke gjenkjenne håndskriften.");
    }
}