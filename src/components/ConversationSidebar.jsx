import React from 'react';
import { Plus, Search, MessageSquare, MoreHorizontal, Pin } from 'lucide-react';
import { format } from 'date-fns'; // Assume date-fns is installed

const ConversationSidebar = ({ conversations = [], isLoading, activeId, onSelect }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3">
                <button
                    onClick={() => onSelect('new-conversation')}
                    className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                >
                    <Plus size={18} />
                    Nueva Conversación
                </button>
            </div>

            <div className="px-4 pb-2">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-green-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-green-200 focus:ring-2 focus:ring-green-100 rounded-lg text-sm transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
                {isLoading ? (
                    <div className="p-4 text-center text-sm text-gray-400">Cargando...</div>
                ) : conversations?.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-gray-500">Aún no tienes conversaciones. Presiona 'Nueva conversación' para empezar.</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent ${activeId === conv.id
                                ? 'bg-green-50/60 border-green-100'
                                : 'hover:bg-gray-50 hover:border-gray-100'
                                }`}
                        >
                            <div className={`mt-1 shrink-0 ${activeId === conv.id ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                <MessageSquare size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className={`text-sm font-medium truncate ${activeId === conv.id ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {conv.title || (conv.lastMessage ? conv.lastMessage.substring(0, 40) : 'Nueva conversación')}
                                    </h4>
                                    {conv.pinned && <Pin size={12} className="text-orange-400 fill-orange-400 ml-1" />}
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-0.5 line-clamp-1">
                                    {conv.lastMessage ? conv.lastMessage.substring(0, 60) : 'Sin mensajes'}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1 block">
                                    {conv.updatedAt ? format(new Date(conv.updatedAt), 'MMM d, h:mm a') : ''}
                                </span>
                            </div>

                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded text-gray-400 hover:text-gray-600 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Context menu logic
                                }}
                            >
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationSidebar;
