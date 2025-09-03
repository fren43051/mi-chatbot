
import { GoogleGenAI, Chat } from "@google/genai";
import { WEBHOOK_URL, DEFAULT_CONTEXT } from "../constants";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const initChat = async (): Promise<{ chat: Chat; initializationError?: string }> => {
  let contextText: string;
  let initializationError: string | undefined;

  try {
    const response = await fetch(WEBHOOK_URL);
    if (!response.ok) {
      throw new Error(`Error al contactar el webhook: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (data.response && typeof data.response === 'string') {
        contextText = data.response;
      } else {
        throw new Error('El JSON del webhook no tiene el formato esperado. Se esperaba un campo "response" con texto.');
      }
    } catch (error) {
      console.error("Failed to parse webhook response as JSON.", { responseText, error });
      if (responseText.trim().toLowerCase() === 'accepted') {
           throw new Error('El webhook respondió con "Accepted" en lugar de los datos de la conversación. Por favor, verifica la configuración de tu webhook en Make.com para asegurarte de que devuelve el texto de la conversación en formato JSON. Ejemplo: `{"response": "tu texto aquí..."}`.');
      }
      throw new Error(`La respuesta del webhook no es un JSON válido. Respuesta recibida: "${responseText}"`);
    }
  } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Ocurrió un error desconocido al obtener el contexto.";
      console.error("Initialization failed, using fallback context:", errorMessage);
      initializationError = errorMessage;
      contextText = DEFAULT_CONTEXT;
  }

  const systemInstruction = `
Aquí está la transcripción completa de una conversación. Tu única tarea es responder preguntas basadas EXCLUSIVAMENTE en este texto. No uses ningún otro conocimiento. Si la pregunta no se puede responder con este texto, di "Lo siento, esa información no está en la conversación que tengo." Responde siempre en español.

--- INICIO DE LA CONVERSACIÓN ---

${contextText}

--- FIN DE LA CONVERSACIÓN ---
`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return { chat, initializationError };
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get a response from the AI.");
  }
};
