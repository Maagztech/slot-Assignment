"use client";

import { useEffect, useState } from "react";

interface ReelsDisplayProps {
    grid: string[][] | null;
    spinning: boolean;
}

export default function ReelsDisplay({ grid, spinning }: ReelsDisplayProps) {
    const [displayGrid, setDisplayGrid] = useState<string[][] | null>(null);
    const [animatingReels, setAnimatingReels] = useState<boolean[]>([false, false, false, false, false]);

    useEffect(() => {
        if (spinning) {
            // Start animation
            setAnimatingReels([true, true, true, true, true]);
        } else if (grid) {
            // Stop animation and display result
            setAnimatingReels([false, false, false, false, false]);

            // Convert row-major grid (3x5) into 5 reels (columns)
            const columns = Array.from({ length: 5 }, (_, colIndex) => [
                grid[0]?.[colIndex] ?? "",
                grid[1]?.[colIndex] ?? "",
                grid[2]?.[colIndex] ?? "",
            ]);

            setDisplayGrid(columns);
        }
    }, [spinning, grid]);

    const renderReel = (symbols: string[], index: number, isAnimating: boolean) => {
        return (
            <div
                key={index}
                className={`flex-1 bg-gradient-to-b from-purple-800 to-purple-950 rounded-lg border-4 border-yellow-500 overflow-hidden h-48 flex flex-col items-center justify-center ${isAnimating ? "animate-pulse" : ""
                    }`}
            >
                {isAnimating ? (
                    <div className="text-4xl animate-bounce">🎲</div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        {symbols.map((symbol, i) => (
                            <div key={i} className="text-4xl font-extrabold">
                                {symbol}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">🎰 Slot Machine</h2>
                <p className="text-gray-400">
                    {spinning
                        ? "Spinning... Good luck! 🍀"
                        : displayGrid
                            ? "Here are your results!"
                            : "Press Spin to start"}
                </p>
            </div>

            {/* Reels Grid */}
            <div className="grid grid-cols-5 gap-3">
                {(displayGrid || Array(5).fill([])).map((reel, idx) => (
                    renderReel(reel || ["🎲"], idx, animatingReels[idx])
                ))}
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-center text-sm">
                    ✨ Match symbols to win! The more matches, the bigger your prize.
                </p>
            </div>
        </div>
    );
}
