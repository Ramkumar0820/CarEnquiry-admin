"use client"
import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import useAuthStore from "@/store/useAuthStore.js"
import { Eye, EyeOff } from "lucide-react";

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
        // Redirect on successful login
        router.push('/');
        setLoading(false);
      } else {
        // Display error message
        setLoading(false);
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-1">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            labelPlacement="outside"
            className="w-full"
            value={email}
            isRequired={true}
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
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-500" />
                ) : (
                  <Eye size={20} className="text-gray-500" />
                )}
              </button>
            }
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button
            className="bg-blue-700 text-white hover:bg-blue-800 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div>
            {/* <p>Email- ranjithkumarsrmtravels@gmail.com</p>
        <p>Password- 123456</p> */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
