"use client"
import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import useAuthStore from "@/store/useAuthStore.js"
import { Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import { Sparkles } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data);
        router.push('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE - LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-3 md:px-6">
        <div className="w-full max-w-md p-4 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/80 space-y-3">
          <div className="flex flex-col justify-center items-center space-y-3">
            <Image
              src="/logo1.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <p className="text-center text-gray-500 mb-6">
              Login to continue your journey
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              labelPlacement="outside"
              value={email}
              isRequired
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              labelPlacement="outside"
              value={password}
              isRequired
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              }
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              className="bg-blue-700 text-white hover:bg-blue-800 mt-2"
              onClick={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - ANIMATED BACKGROUND */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center">

        {/* Animated Gradient Background */}
        <div className="absolute inset-0 animated-bg"></div>

        {/* Floating Glow Effects */}
        <div className="absolute w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-3xl top-10 left-10 animate-float"></div>
        <div className="absolute w-[250px] h-[250px] bg-purple-500/30 rounded-full blur-3xl bottom-10 right-10 animate-float delay-2000"></div>

        {/* CONTENT */}
        <div className="relative z-10 text-white text-center px-10 animate-fadeIn">
          <h2 className="text-4xl font-bold mb-4 leading-tight flex items-center justify-center gap-2">
            Travel Beyond Expectations
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </h2>

          <p className="text-lg max-w-2xl text-white/90">
            Discover seamless cab services with Madurai SRM Travels — where comfort meets reliability.
            From city rides to long-distance journeys, travel with confidence and ease.
          </p>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;