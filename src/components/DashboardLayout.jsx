import React, { useState } from 'react';
import { useQuery } from 'react-query';
import ConversationSidebar from './ConversationSidebar';
import ChatWindow from './ChatWindow';
import { Menu, User, Settings, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';

// Mock Fetcher
const fetchConversations = async (userId) => {
    // Replace with actual API call
    const queryParams = userId ? `?userId=${userId}` : '';
    const response = await fetch(`/api/conversations${queryParams}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const responseData = await response.json();
    // Handle both array response and object with data property
    return Array.isArray(responseData) ? { data: responseData } : responseData;
};

const DashboardLayout = ({ user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState(null);

    const { data: conversationsData, isLoading, error, refetch: refetchConversations } = useQuery(
        ['conversations', user?.id],
        () => fetchConversations(user?.id),
        { 
            enabled: !!user?.id,
            refetchInterval: 5000 // Refetch every 5 seconds to keep history updated
        }
    );
    
    const conversations = conversationsData?.data || [];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">

            {/* Mobile Drawer Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-hidden="true"
                />
            )}

            {/* LEFT SIDEBAR */}
            <aside
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed lg:relative z-30 w-80 lg:w-[360px] h-full bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 ease-in-out flex flex-col`}
                aria-label="Sidebar de Navegación"
            >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-green-600 tracking-tight flex items-center gap-2">
                        <span className="bg-green-100 p-1.5 rounded-lg">🥑</span> NutriAI
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                        aria-label="Cerrar menú"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ConversationSidebar
                        conversations={conversations}
                        isLoading={isLoading}
                        activeId={activeConversationId}
                        onSelect={setActiveConversationId}
                    />
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.user_metadata?.first_name
                                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                                    : 'Usuario Invitado'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'Modo Demo'}</p>
                        </div>
                        <Settings size={18} className="text-gray-400" />
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-gray-50/30 relative">
                {/* Header (Mobile Toggle) */}
                {!isSidebarOpen && (
                    <header className="lg:hidden h-14 bg-white border-b border-gray-100 flex items-center px-4 justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600"
                            aria-label="Abrir menú"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-semibold text-gray-800">Chat</span>
                        <div className="w-8" />
                    </header>
                )}

                {/* Chat Area */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col h-full relative">
                        {activeConversationId ? (
                            <ChatWindow
                                conversationId={activeConversationId}
                                onConversationCreated={(convId) => {
                                    setActiveConversationId(convId);
                                    refetchConversations(); // Refresh conversation list
                                }}
                                user={user}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="text-4xl">🥗</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bienvenido a NutriAI</h2>
                                <p className="max-w-md">Selecciona una conversación o inicia una nueva para recibir asesoría nutricional personalizada.</p>
                                <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-xl font-medium shadow-lg shadow-green-200 hover:bg-green-700 transition-all">
                                    + Nueva Conversación
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar Toggle */}
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white border border-gray-200 shadow-md p-1.5 rounded-full text-gray-400 hover:text-green-600 transition-colors ${isProfileOpen ? 'rotate-180' : ''}`}
                        aria-label="Alternar panel lateral"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* RIGHT SIDEBAR (Profile/Details) */}
                    <aside
                        className={`${isProfileOpen ? 'w-80 border-l px-6 py-6' : 'w-0 px-0 py-0 opacity-0 overflow-hidden'
                            } hidden lg:block bg-white border-gray-100 transition-all duration-300 ease-in-out`}
                    >
                        <div className="min-w-[18rem]"> {/* Prevent content squash */}
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Tu Resumen</h3>
                            <div className="bg-green-50 p-4 rounded-2xl mb-6">
                                <div className="text-sm text-green-800 font-medium mb-1">Objetivo</div>
                                <div className="text-2xl font-bold text-green-700">Perder 6kg</div>
                                <div className="w-full bg-green-200 h-2 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-green-500 h-full w-[35%]"></div>
                                </div>
                                <div className="text-xs text-green-600 mt-1 text-right">35% completado</div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700">Recomendaciones Rápidas</h4>
                                {['Beber 2L de agua', 'Reducir sodio', 'Cerrar anillos de actividad'].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
