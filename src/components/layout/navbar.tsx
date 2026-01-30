"use client";

import { Github, LayoutDashboard, LogOut, Rocket } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group shrink-0">
                    <motion.div
                        className="relative w-14 h-14 overflow-hidden rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <img
                            src="/tucode-pamoja-logo.png"
                            alt="Logo"
                            className="w-full h-full object-contain mix-blend-screen"
                        />
                    </motion.div>
                    <span className="font-display font-black text-xl md:text-2xl tracking-tighter brand-gradient-text uppercase leading-none whitespace-pre-line">
                        Tucode{"\n"}Pamoja
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-8 mr-4 text-sm font-medium text-text-secondary">
                        <Link href="/#projects" className="hover:text-primary-400 transition-colors">Projects</Link>
                        <a href="#" className="hover:text-primary-400 transition-colors">Services</a>
                        <a href="#" className="hover:text-primary-400 transition-colors">Contact</a>
                    </div>

                    {session ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 text-sm font-medium hover:text-primary-400 transition-colors bg-surface-1/50 px-4 py-2 rounded-xl border border-surface-3"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <p className="hidden sm:block">Dashboard</p>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 rounded-xl bg-surface-1/50 px-4 py-2 text-sm font-medium border border-surface-3 hover:bg-surface-2 transition-all text-text-muted"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("github")}
                            className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-400 px-6 py-2 text-sm font-bold text-white transition-all shadow-lg shadow-primary-500/20"
                        >
                            <Github className="h-4 w-4" />
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
