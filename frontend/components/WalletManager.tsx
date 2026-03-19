"use client";

import { useState } from "react";
import * as api from "@/lib/api";

interface WalletManagerProps {
    token: string;
    onAddFunds: (newBalance: number) => void;
}

export default function WalletManager({
    token,
    onAddFunds,
}: WalletManagerProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const commonAmounts = [10, 25, 50, 100, 200, 500];

    const handleAddFunds = async (addAmount: number) => {
        if (addAmount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const result = await api.addToWallet(token, addAmount);
            onAddFunds(result.wallet);
            setAmount("");
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to add funds");
        } finally {
            setLoading(false);
        }
    };

    const handleCustomAmount = async (e: React.FormEvent) => {
        e.preventDefault();
        const customAmount = parseFloat(amount);

        if (isNaN(customAmount) || customAmount <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        await handleAddFunds(customAmount);
    };

    return (
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-green-500/50 shadow-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
                💳 Add Funds
            </h3>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 mb-4">
                {commonAmounts.map((amt) => (
                    <button
                        key={amt}
                        onClick={() => handleAddFunds(amt)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 px-2 rounded-lg transition transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
                    >
                        +${amt}
                    </button>
                ))}
            </div>

            {/* Custom Amount */}
            <form onSubmit={handleCustomAmount} className="space-y-3 mb-4">
                <div className="flex gap-2">
                    <div className="flex-1 flex items-center bg-white/10 border-2 border-green-500/30 rounded-lg px-3">
                        <span className="text-green-400 font-bold">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Custom"
                            step="0.01"
                            min="0"
                            className="flex-1 bg-transparent text-white ml-2 focus:outline-none text-sm sm:text-base"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !amount}
                        className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base"
                    >
                        Add
                    </button>
                </div>
            </form>

            {/* Messages */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-3">
                    <p className="text-red-200 text-sm">⚠️ {error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                    <p className="text-green-200 text-sm font-semibold">
                        ✅ Funds added successfully!
                    </p>
                </div>
            )}

            {loading && (
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );
}
