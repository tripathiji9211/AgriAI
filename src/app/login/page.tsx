"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-green-50/50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl bg-white/80 backdrop-blur-sm border-green-100">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="rounded-full bg-green-100 p-4 shadow-inner">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-900 tracking-tight">Welcome to AgriAI</h1>
            <p className="text-sm text-gray-500">Sign in to access your farm dashboard</p>
          </div>

          <div className="w-full space-y-4 mt-8">
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg border-2 hover:bg-green-50"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
            
            <Button 
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <Smartphone className="w-6 h-6 mr-3" />
              Continue with Phone
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  );
}
