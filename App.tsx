import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from "@google/genai";
import ChatInterface from './components/ChatInterface';
import { ChatMessage, MessageSender, MessageType } from './types';
import { initChat, sendMessageToGemini } from './services/geminiService';
import { WEBHOOK_URL } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      const { chat, initializationError } = await initChat();
      chatSessionRef.current = chat;
      
      let initialBotMessage: ChatMessage;

      if (initializationError) {
        const warningText = `No se pudo cargar la conversación desde el webhook específico configurado en la aplicación:\n\n**URL:** \`${WEBHOOK_URL}\`\n\n**Error:** ${initializationError}\n\nHe cargado una conversación de ejemplo para que puedas probar el chat. Cuando soluciones el problema con tu webhook en Make.com, solo actualiza la página.`
        initialBotMessage = {
          id: Date.now(),
          text: warningText,
          sender: MessageSender.BOT,
          type: MessageType.WARNING,
        };
      } else {
        initialBotMessage = {
          id: Date.now(),
          text: 'Hola. Soy un asistente experto en la conversación sobre Make.com y Gemini. ¿En qué puedo ayudarte?',
          sender: MessageSender.BOT,
        };
      }
      setMessages([initialBotMessage]);
      setIsLoading(false);
    };
    initializeChat();
  }, []);
  
  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: userInput,
      sender: MessageSender.USER,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        throw new Error("Chat session not initialized.");
      }

      const botResponseText = await sendMessageToGemini(chatSessionRef.current, userInput);
      
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: MessageSender.BOT,
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (e) {
      console.error("Failed to send message:", e);
      const errorMessage = "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.";
       const errorBotMessage: ChatMessage = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: MessageSender.BOT,
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;