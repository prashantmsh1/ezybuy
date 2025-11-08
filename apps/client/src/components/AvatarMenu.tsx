"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CircleUser, LogOut, MenuIcon, ShoppingBagIcon } from "lucide-react";

const AvatarMenu = () => {
    const { user, loading, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const handleLogout = async () => {
        await logout();
        setOpen(false);
        router.push("/");
    };

    const getInitials = (nameOrEmail?: string | null) => {
        const s = String(nameOrEmail || "").trim();
        if (!s) return "U";
        const parts = s.split(" ").filter(Boolean);
        const first = (parts[0] ?? "").charAt(0) || "U";
        if (parts.length === 1) return first.toUpperCase();
        const last = (parts[parts.length - 1] ?? "").charAt(0) || "U";
        return (first + last).toUpperCase();
    };

    if (loading) return <div className="text-sm text-gray-500">...</div>;

    if (!user) {
        return (
            <Link href="/login" className="text-sm font-medium">
                Sign in
            </Link>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none"
                aria-label="User menu">
                {user.photoURL ? (
                    <Image
                        src={user.photoURL}
                        alt={user.displayName ?? "avatar"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                        {getInitials(user.displayName ?? user.email)}
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 border-gray-200 bg-white border rounded-md shadow-lg z-20">
                    <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <CircleUser className="inline-block mr-2 h-4 w-4" />
                        Profile
                    </Link>
                    <Link
                        href="/orders"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <ShoppingBagIcon className="inline-block mr-2 h-4 w-4" />
                        Orders
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                        <LogOut className="inline-block mr-2 h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvatarMenu;
