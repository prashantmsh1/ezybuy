"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const { signUp, signInWithGoogle } = useAuth();
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

    const validateConfirmPassword = (confirmPassword: string, password: string) => {
        if (!confirmPassword) return "Please confirm your password";
        if (confirmPassword !== password) return "Passwords do not match";
        return "";
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        const confirmErr = validateConfirmPassword(confirmPassword, password);

        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setConfirmPasswordError(confirmErr);

        if (emailErr || passwordErr || confirmErr) return;

        setLoading(true);
        setError("");
        try {
            await signUp(email, password);
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
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
        if (confirmPassword && confirmPasswordError) {
            setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (confirmPasswordError) setConfirmPasswordError("");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us today and start shopping</p>
                </div>

                {/* Google Sign Up Button */}
                <button
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Chrome className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-linear-to-br from-purple-50 via-white to-blue-50 text-gray-500">
                            Or create with email
                        </span>
                    </div>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleSignUp} className="space-y-6">
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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

                    {/* Confirm Password Field */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {confirmPasswordError && (
                            <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
                        )}
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-purple-600 hover:text-purple-500 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
