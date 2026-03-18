"use client";

import { useAuth } from "@/context/AuthContext";
import SignIn from "@/components/SignIn";
import SlotMachine from "@/components/SlotMachine";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 to-purple-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <SlotMachine /> : <SignIn />;
}
