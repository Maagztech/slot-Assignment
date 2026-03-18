"use client";

import SignIn from "@/components/SignIn";
import SlotMachine from "@/components/SlotMachine";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 to-purple-950">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p className="mt-4 text-lg font-semibold text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <SlotMachine /> : <SignIn />;
}
