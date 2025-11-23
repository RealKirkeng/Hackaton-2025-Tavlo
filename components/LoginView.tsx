
import React, { useState } from 'react';
import { KeyIcon } from './Icons';

interface LoginViewProps {
    onLoginSuccess: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(() => {
            onLoginSuccess();
            setIsLoading(false);
        }, 1000);
    };

    return (
        <main className="flex-grow flex flex-col items-center justify-center bg-stone-100 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-5xl font-bold text-gray-800">Tavlo</h1>
                    <p className="text-gray-600 mt-2">Din digitale læringsarena</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
                    <button
                        onClick={() => handleLogin()}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold disabled:bg-gray-400"
                    >
                        Logg inn med FEIDE
                    </button>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-t border-stone-300" />
                        <span className="mx-4 text-xs font-semibold text-gray-500">eller</span>
                        <hr className="flex-grow border-t border-stone-300" />
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700" htmlFor="username">
                                Brukernavn
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                className="mt-1 block w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                Passord
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="mt-1 block w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <KeyIcon className="w-5 h-5" />
                            )}
                            <span>Logg inn</span>
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginView;
