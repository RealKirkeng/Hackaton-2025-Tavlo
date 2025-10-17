
import React, { useState, useRef, useEffect } from 'react';
import { MessageAuthor, ChatMessage } from '../types';
import { getAiAssistance } from '../services/geminiService';
import { CloseIcon, SendIcon, SparklesIcon, UserIcon } from './Icons';

interface AiChatProps {
  isOpen: boolean;
  onClose: () => void;
  documentContext: string;
}

const AiChat: React.FC<AiChatProps> = ({ isOpen, onClose, documentContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { author: MessageAuthor.AI, text: "Hei! Jeg er KAI. 👋 Hvordan kan jeg hjelpe deg med skolearbeidet i dag?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (isOpen) {
        setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { author: MessageAuthor.USER, text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
        const aiResponse = await getAiAssistance(userInput, documentContext);
        setMessages([...newMessages, { author: MessageAuthor.AI, text: aiResponse }]);
    } catch (error) {
        setMessages([...newMessages, { author: MessageAuthor.SYSTEM, text: "Beklager, jeg fikk ikke svar. Prøv igjen." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80%] bg-amber-50/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-200">
        <header className="flex items-center justify-between p-4 border-b border-amber-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-800">KAI</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100">
            <CloseIcon className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : ''}`}>
              {msg.author === MessageAuthor.AI && (
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-md p-3 rounded-2xl shadow-sm ${
                msg.author === MessageAuthor.AI ? 'bg-white text-gray-800 rounded-tl-none border border-gray-200' : 
                msg.author === MessageAuthor.USER ? 'bg-sky-500 text-white rounded-tr-none' : 
                'bg-red-100 text-red-800'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.author === MessageAuthor.USER && (
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-md p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none border border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-amber-200 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-sky-500">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Still et spørsmål..."
              className="w-full p-2 bg-transparent border-none focus:ring-0 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              className="p-2 m-1 rounded-md bg-sky-500 text-white hover:bg-sky-600 disabled:bg-sky-200 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AiChat;
