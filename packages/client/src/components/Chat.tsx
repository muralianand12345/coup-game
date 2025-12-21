import { FC, useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@coup/shared';

interface ChatProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    playerId: string;
}

export const Chat: FC<ChatProps> = ({ messages, onSendMessage, playerId }) => {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="glass-panel flex flex-col h-80 overflow-hidden">
            <div className="px-4 py-3 border-b border-coup-border">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-600 text-xs mt-8">
                        No messages yet. Say hi! 👋
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.playerId === playerId;
                        const initial = msg.playerName.charAt(0).toUpperCase();
                        
                        return (
                            <div 
                                key={msg.id} 
                                className={`flex gap-3 items-start animate-fade-in-up ${isMe ? 'flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                    isMe 
                                        ? 'bg-white text-black' 
                                        : 'bg-coup-border text-gray-400'
                                }`}>
                                    {initial}
                                </div>
                                
                                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className="text-xs text-gray-400 mb-1 px-1 font-medium">
                                        {msg.playerName}
                                    </span>
                                    <div className={`px-3 py-2 rounded-2xl ${
                                        isMe 
                                            ? 'bg-white text-black rounded-tr-sm' 
                                            : 'bg-coup-card-hover border border-coup-border text-gray-200 rounded-tl-sm'
                                    }`}>
                                        <p className="text-sm leading-relaxed break-words">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-3 border-t border-coup-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="input-field flex-1 text-sm py-2"
                        maxLength={200}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className="btn-primary px-4 py-2 text-sm"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};
