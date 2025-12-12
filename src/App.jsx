import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { LoginForm, RegisterForm } from './components/AuthForms';

function App() {
  const [route, setRoute] = useState('login'); // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedInUser) => {
    console.log('User logged in:', loggedInUser);
    setUser(loggedInUser);
    setRoute('dashboard');
  };

  if (route === 'dashboard') {
    return <DashboardLayout user={user} />;
  }

  const isLogin = route === 'login';

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* LEFT SIDE: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative z-10">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setRoute('register')}
            />
          ) : (
            <RegisterForm onRegisterSuccess={() => setRoute('login')} />
          )}
          {/* Dev Skip Button */}
          <div className="absolute bottom-4 left-4">
            <button onClick={() => setRoute('dashboard')} className="text-xs text-gray-300 hover:text-gray-500">Skip to Dashboard (Dev)</button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Branding & Background */}
      <div className="hidden md:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
        {/* Abstract Background with Blur */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-green-500/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 inline-block mb-8 shadow-2xl overflow-hidden w-64 h-64 relative group hover:scale-105 transition-transform duration-500">
            <img src="/avocado.jpg" alt="NutriAI Logo" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
            NutriAI
          </h1>
          <p className="text-lg text-gray-300 font-light max-w-sm mx-auto leading-relaxed">
            Tu asistente personal de nutrición impulsado por inteligencia artificial.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
