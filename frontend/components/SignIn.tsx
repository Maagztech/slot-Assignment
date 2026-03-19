"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
    const { login, signup } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (account.trim().length < 3) {
                setError("Account must be at least 3 characters");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            if (isSignUp) {
                await signup(account, password);
            } else {
                await login(account, password);
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">🎰 SlotMachine</h1>
                    <p className="text-purple-200 text-base sm:text-lg">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        {/* Account Input */}
                        <div>
                            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                                {isSignUp ? "Email or Username" : "Account"}
                            </label>
                            <input
                                type="text"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                placeholder="Enter your account"
                                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition text-sm sm:text-base"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition text-sm sm:text-base"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 animate-shake">
                                <p className="text-red-200 text-sm font-medium">⚠️ {error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg text-base sm:text-lg"
                        >
                            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                        </button>

                        {/* Toggle Button */}
                        <div className="text-center pt-4 border-t border-white/20">
                            <p className="text-gray-300 mb-3 text-sm">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError("");
                                }}
                                className="text-blue-300 hover:text-blue-200 font-semibold transition text-sm sm:text-base"
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 sm:mt-8 text-gray-300 text-xs sm:text-sm">
                    <p>💡 Use any email and password (6+ chars) to get started</p>
                </div>
            </div>
        </div>
    );
}
