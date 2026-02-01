
"use client";

import TeamSection from "@/components/team/team-section";
import { motion } from "framer-motion";

export default function TeamPage() {
    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="fixed top-0 -z-10 h-full w-full bg-[#050508] overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/team-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/10 via-[#050508]/40 to-[#050508]/80" />
            </div>

            <main className="min-h-screen pt-32 pb-20">
                <TeamSection />
            </main>
        </div>
    );
}

