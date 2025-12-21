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
    <div className="bg-coup-card border border-coup-border rounded-lg flex flex-col h-64">
      <div className="p-2 border-b border-coup-border">
        <h3 className="text-sm font-bold text-gray-400">Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <span className={`font-bold ${msg.playerId === playerId ? 'text-yellow-400' : 'text-white'}`}>
              {msg.playerName}:
            </span>
            <span className="text-gray-300 ml-1">{msg.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-2 border-t border-coup-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1 text-sm py-1"
            maxLength={200}
          />
          <button type="submit" className="btn-primary py-1 px-3 text-sm">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
