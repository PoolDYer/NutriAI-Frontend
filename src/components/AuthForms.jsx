import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon size={18} className="text-gray-400" />
                </div>
            )}
            <input
                className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-100 focus:border-green-400 outline-none text-sm transition-all`}
                {...props}
            />
        </div>
    </div>
);

export const LoginForm = (props) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Login failed');

            // Store token
            localStorage.setItem('access_token', data.accessToken);
            if (props.onLoginSuccess) props.onLoginSuccess(data.user);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
                <p className="text-gray-500 text-sm mt-2">Ingresa tus datos para acceder a tu panel.</p>
            </div>

            <form onSubmit={handleLogin}>
                <InputField
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    icon={Mail}
                    required
                />
                <InputField
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    required
                />

                <div className="flex items-center justify-between mb-6 text-sm">
                    <label className="flex items-center text-gray-600 cursor-pointer">
                        <input type="checkbox" className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        Recordarme
                    </label>
                    <a href="#" className="text-green-600 font-medium hover:text-green-700">¿Olvidaste tu contraseña?</a>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium shadow-lg shadow-gray-200 hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">O continúa con</span></div>
            </div>

            <button className="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Chrome size={20} className="text-gray-900" /> Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-600">
                ¿No tienes cuenta? <button onClick={props.onSwitchToRegister} className="text-green-600 font-semibold hover:text-green-700">Regístrate gratis</button>
            </p>
        </div>
    );
};

export const RegisterForm = ({ onRegisterSuccess }) => {
    const handleRegister = async (e) => {
        e.preventDefault();
        // Indices: 0:First, 1:Last, 2:Email, 3:Pass
        const firstName = e.target[0].value;
        const lastName = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;
        const confirmPassword = e.target[4].value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            alert('Registro exitoso. Por favor inicia sesión.');
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
                <p className="text-gray-500 text-sm mt-2">Para darte recomendaciones exactas, comienza aquí.</p>
            </div>

            <form onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Nombre" type="text" placeholder="Juan" required />
                    <InputField label="Apellido" type="text" placeholder="Pérez" required />
                </div>
                <InputField label="Email" type="email" placeholder="tu@email.com" required />
                <InputField label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" required />
                <InputField label="Confirmar Contraseña" type="password" placeholder="Repite tu contraseña" required />

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-medium shadow-lg shadow-green-200 hover:bg-green-700 transition-all mt-2"
                >
                    Registrarse
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                ¿Ya tienes cuenta? <button onClick={onRegisterSuccess} className="text-green-600 font-semibold hover:text-green-700">Inicia sesión</button>
            </p>
        </div>
    );
};
