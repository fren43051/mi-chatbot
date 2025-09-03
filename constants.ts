
export const WEBHOOK_URL = 'https://hook.us2.make.com/vumibncmbx5qhgj7vtlmibg56kqah4vo';

export const DEFAULT_CONTEXT = `
Juan: Hola, ¿cómo puedo crear un chatbot que use la API de Gemini?
Asistente de IA: ¡Claro! Puedes usar Make.com para conectar Gemini a una plataforma de chat.
Juan: ¿Qué necesito para empezar?
Asistente de IA: Primero, necesitarás una cuenta en Make.com y una clave de API de Google AI Studio para Gemini.
Juan: Entendido. ¿Cómo conecto Gemini en Make.com?
Asistente de IA: En tu escenario de Make.com, añade el módulo de Google Gemini. Luego, configúralo con tu clave de API y el prompt que quieres que use el chatbot.
Juan: ¿Y para recibir los mensajes del usuario?
Asistente de IA: Puedes usar un módulo de webhook como disparador (trigger). Cada vez que el webhook reciba un mensaje, activará tu escenario de Make.com y enviará el texto a Gemini.
Juan: ¡Genial! ¿Y la respuesta de Gemini?
Asistente de IA: El módulo de Gemini devolverá la respuesta, y puedes usar otro módulo, como el de "Webhook Response", para enviarla de vuelta al usuario.
Juan: Muchas gracias, me queda mucho más claro.
`;
