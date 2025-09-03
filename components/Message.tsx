import React from 'react';
import type { ChatMessage } from '../types';
import { MessageSender, MessageType } from '../types';
import { UserIcon, BotIcon, WarningIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
    </div>
);

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <div key={i}>
          {line.split(/(`.*?`|\*\*.*?\*\*)/g).filter(Boolean).map((part, j) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={j} className="bg-yellow-200 dark:bg-yellow-800 px-1.5 py-1 rounded text-sm font-mono break-all">
                  {part.slice(1, -1)}
                </code>
              );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      ))}
    </>
  );
};


const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  if (message.type === MessageType.WARNING) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-yellow-400 text-white">
          <WarningIcon />
        </div>
        <div className="text-yellow-800 dark:text-yellow-200 text-sm">
          <p className="font-bold mb-1">Atención</p>
          <div>
             <FormattedText text={message.text} />
          </div>
        </div>
      </div>
    );
  }

  const isUser = message.sender === MessageSender.USER;

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
       <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500 text-white' : 'bg-indigo-500 text-white'}`}>
         {isUser ? <UserIcon /> : <BotIcon />}
       </div>

      <div className={`max-w-[75%] p-4 rounded-2xl ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
        {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.text}</p>}
      </div>
    </div>
  );
};

export default Message;