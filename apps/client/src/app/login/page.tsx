"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Chrome, LogInIcon } from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { signIn, signInWithGoogle } = useAuth();
    const router = useRouter();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return "";
    };

    const validatePassword = (password: string) => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (emailErr || passwordErr) return;

        setLoading(true);
        setError("");
        try {
            await signIn(email, password);
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            await signInWithGoogle();
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) setEmailError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (passwordError) setPasswordError("");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="30"
                        height="30"
                        viewBox="0 0 48 48">
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-linear-to-br from-blue-50 via-white to-purple-50 text-gray-500">
                            Or continue with email
                        </span>
                    </div>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSignIn} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>
                        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                        )}
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
