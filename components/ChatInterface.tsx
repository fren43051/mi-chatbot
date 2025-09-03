
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
// FIX: Import MessageSender to use its enum values.
import { MessageSender } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import { BotIcon } from './IconComponents';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col w-full max-w-2xl h-[90vh] max-h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3 bg-gray-50 dark:bg-gray-900/50">
        <div className="p-2 bg-indigo-500 rounded-full text-white">
            <BotIcon />
        </div>
        <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">Asistente de Make.com</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pregúntame sobre la conversación</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {/* FIX: Use MessageSender enum instead of string literal 'bot' to fix type error. */}
        {isLoading && <Message key="loading" message={{ id: 0, text: '...', sender: MessageSender.BOT }} isLoading={true} />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
