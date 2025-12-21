import { ChatMessage } from '@coup/shared';
import { FC, useState, useRef, useEffect } from 'react';

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
            <div className="px-4 py-3 border-b border-zinc-800/50">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-600 text-xs">Start the conversation 👋</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.playerId === playerId;
                        const initial = msg.playerName.charAt(0).toUpperCase();

                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-3 items-start animate-fade-in-up ${isMe ? 'flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${Math.min(index * 0.02, 0.2)}s` }}
                            >
                                <div className={`
                                    w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0
                                    ${isMe ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400'}
                                `}>
                                    {initial}
                                </div>

                                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-zinc-500 mb-1 px-1 font-medium">
                                        {msg.playerName}
                                    </span>
                                    <div className={`
                                        px-3 py-2 rounded-2xl text-sm leading-relaxed
                                        ${isMe
                                            ? 'bg-zinc-100 text-zinc-900 rounded-tr-md'
                                            : 'bg-zinc-800/80 text-zinc-200 rounded-tl-md'
                                        }
                                    `}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800/50">
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
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};