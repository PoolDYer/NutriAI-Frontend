import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Send, Paperclip, MoreVertical, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Component for individual message bubble
const MessageBubble = ({ message, isBestPayload }) => {
    const isUser = (message.role || message.metadata?.role) === 'user';

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-gray-200' : 'bg-green-100 text-green-600'}`}>
                    {isUser ? 'U' : 'AI'}
                </div>

                <div className={`group relative p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                    {isUser ? (
                        <p>{message.content}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-green">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    )}
                    <span className={`text-[10px] absolute bottom-2 ${isUser ? 'left-2 text-blue-200' : 'right-2 text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        10:42 AM
                    </span>
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ conversationId, onConversationCreated, user }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch Messages
    const { data: messages = [], isLoading } = useQuery(
        ['messages', conversationId],
        async () => {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);
            if (!res.ok) throw new Error('Failed to load messages');
            return res.json();
        },
        {
            enabled: !!conversationId && conversationId !== 'new-conversation'
        }
    );

    // Send Message Mutation
    const mutation = useMutation(
        async (newMsg) => {
            let targetId = conversationId;
            let isNewConversation = false;

            // 1. Create Conversation if new
            if (conversationId === 'new-conversation') {
                const createRes = await fetch('/api/conversations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patientId: 'me' }) // Backend replaces 'me' with userId or handles it
                });
                if (!createRes.ok) throw new Error('Failed to create conversation');
                const convData = await createRes.json();
                targetId = convData.id;
                isNewConversation = true;

                // Notify parent
                if (onConversationCreated) onConversationCreated(targetId);
            }

            // 2. Send Message
            const res = await fetch(`/api/conversations/${targetId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMsg),
            });
            if (!res.ok) throw new Error('Failed to send');
            const messageData = await res.json();
            
            // 3. Update conversation title if first message
            if (isNewConversation && newMsg.content) {
                const title = newMsg.content.substring(0, 50) + (newMsg.content.length > 50 ? '...' : '');
                await fetch(`/api/conversations/${targetId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                }).catch(() => {}); // Ignore errors on title update
            }
            
            return messageData;
        },
        {
            onMutate: async (newMessage) => {
                await queryClient.cancelQueries(['messages', conversationId]);
                const previousMessages = queryClient.getQueryData(['messages', conversationId]);

                // Optimistically add user message
                queryClient.setQueryData(['messages', conversationId], (old) => [
                    ...(old || []),
                    { id: 'temp-id', role: 'user', content: newMessage.content, createdAt: new Date().toISOString() }
                ]);

                return { previousMessages };
            },
            onError: (err, newTodo, context) => {
                queryClient.setQueryData(['messages', conversationId], context.previousMessages);
                alert('Error sending message: ' + err.message);
            },
            onSettled: () => {
                // Invalidate original ID (clears 'new') AND new ID if possible, but simplest is to invalidate current
                queryClient.invalidateQueries(['messages', conversationId]);
                // FIX: Invalidate the specific user conversations key
                queryClient.invalidateQueries(['conversations', user?.id]);
            },
        }
    );

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        mutation.mutate({ content: inputValue, role: 'user' });
        setInputValue('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, mutation.isLoading]);

    return (
        <div className="flex flex-col h-full bg-white/50">
            {/* Header */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                <div>
                    <h2 className="font-semibold text-gray-800">Plan de Pérdida de Peso</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                </div>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full text-gray-400">
                        <RefreshCw className="animate-spin mr-2" /> Cargando historial...
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}

                        {/* AI Typing Indicator */}
                        {mutation.isLoading && (
                            <div className="flex w-full justify-start mb-6">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">AI</div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex gap-2 items-end">
                    <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <Paperclip size={20} />
                    </button>

                    <div className="flex-1 bg-gray-50 rounded-xl border-gray-200 border focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pregunta sobre tu dieta..."
                            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 max-h-32 text-gray-700 placeholder-gray-400"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!inputValue.trim() || mutation.isLoading}
                        className="p-3 bg-green-600 text-white rounded-xl shadow-md shadow-green-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-400">NutriAI puede cometer errores. Verifica la información médica importante.</p>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
