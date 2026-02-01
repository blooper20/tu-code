"use client";

import { Github, LayoutDashboard, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ... imports
import { useState, useEffect } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Visibility Logic
    const [isVisible, setIsVisible] = useState(true); // Default true to avoid flash, controlled by effect

    useEffect(() => {
        // If not on home page, always visible.
        if (pathname !== "/") {
            setIsVisible(true);
            return;
        }

        // On Home page, default hidden initially 
        setIsVisible(false);

        let isHovered = false;
        let isScrolled = false;

        const updateVisibility = () => setIsVisible(isHovered || isScrolled);

        const handleMouseMove = (e: MouseEvent) => {
            const inZone = e.clientY < 100;
            if (inZone !== isHovered) {
                isHovered = inZone;
                updateVisibility();
            }
        };

        const handleHomeScroll = (e: Event) => {
            const scrollTop = (e as CustomEvent).detail;
            const scrolled = scrollTop > 50;
            if (scrolled !== isScrolled) {
                isScrolled = scrolled;
                updateVisibility();
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("home-scroll", handleHomeScroll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("home-scroll", handleHomeScroll);
        };
    }, [pathname]);

    const isMemberModalOpen = !!searchParams?.get("memberId");

    // Hide Navbar on Admin pages OR when member modal is open
    if (pathname?.startsWith("/admin") || isMemberModalOpen) return null;

    const navItems = [
        { name: "About", href: "/" },
        { name: "Projects", href: "/projects" },
        { name: "Team", href: "/team" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 h-32 pointer-events-none transition-all duration-500 transform",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
        >
            {/* Trendy Gradient Mask - Fades out content rolling under the navbar */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#050508]/80 to-transparent" />

            <div className="container mx-auto px-6 h-24 flex justify-between items-center relative z-10 pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group">
                    <motion.div
                        className="relative h-12 w-12 flex items-center justify-center shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src="/tucode-pamoja-logo.png"
                            alt="Logo"
                            className="h-full w-full object-contain mix-blend-screen"
                        />
                    </motion.div>
                    <span className="font-display font-black text-xl tracking-tighter brand-gradient-text uppercase leading-none whitespace-pre-line hidden md:block">
                        Tucode{"\n"}Pamoja
                    </span>
                </Link>

                {/* Center Navigation - Glassmorphism Pill */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-2xl p-1.5 rounded-full border border-white/10 shadow-xl">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all relative",
                                    isActive ? "text-white" : "text-white/60 hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side - Auth */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-sm font-bold text-white/70 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10">
                                대시보드
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("github")}
                            className="flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 text-sm font-black hover:bg-white/90 transition-all shadow-xl shadow-white/10"
                        >
                            <Github className="h-4 w-4" />
                            <span className="hidden sm:inline">ADMIN SIGN IN</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
