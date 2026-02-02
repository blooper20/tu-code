"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link as LinkIcon, Github, Trophy } from "lucide-react";
import Link from "next/link";

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    github_url?: string;
    thumbnail_url?: string;
    tags?: string[];
    // New fields
    one_line_intro?: string;
    short_message?: string;
    background_color?: string; // hex
    background_image_url?: string;
    use_github_data?: boolean;
    use_glassmorphism?: boolean;
    representative_project?: string;
    related_project_ids?: string[];
    custom_content?: string;
    readme_content?: string;
}

export default function TeamCardPremium({ member, onClick, projectUrl }: { member: TeamMember; onClick: () => void; projectUrl?: string }) {
    // Defaults
    const bgColor = member.background_color || "#3b82f6"; // Default blue like current theme or user preference
    const bgImage = member.background_image_url;
    const isGlass = member.use_glassmorphism && !bgImage;
    const textColor = "text-white"; // Assuming dark backgrounds usually? Or we need text color control. For now white.

    return (
        <motion.div
            layoutId={`card-${member.id}`}
            onClick={onClick}
            className={`relative w-full min-h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-1 ${isGlass ? 'backdrop-blur-[20px] bg-opacity-20 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]' : ''}`}
            style={{ backgroundColor: isGlass ? 'transparent' : bgColor }}
        >
            {/* 0. Glass Color Base Layer (Semi-transparent) */}
            {isGlass && (
                <div
                    className="absolute inset-0 z-0 transition-opacity duration-500"
                    style={{ backgroundColor: bgColor, opacity: 0.35 }}
                />
            )}

            {/* 1. Background Image Layer */}
            {bgImage ? (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={bgImage}
                        alt="bg"
                        fill
                        className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                </div>
            ) : isGlass && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Strong Glossy Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent mix-blend-overlay opacity-80" />

                    {/* Subtle Noise Texture Effect (Optional but adds to glass feel) */}
                    <div
                        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* Reflection Highlight */}
                    <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-gradient-to-br from-white/20 via-transparent to-transparent blur-2xl opacity-60" />

                    {/* Inner Border Shine */}
                    <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-1px_0_0_rgba(0,0,0,0.2)] rounded-[3rem]" />
                </div>
            )}

            {/* 2. Main Content Layer */}
            <div className="absolute inset-0 z-10 p-6 md:p-10 flex flex-col">

                {/* Header: Position */}
                <div className="w-full flex justify-center">
                    <div className="px-5 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/90 text-xs md:text-sm font-mono tracking-[0.2em] uppercase shadow-lg">
                        {member.role || "MEMBER"}
                    </div>
                </div>

                {/* Middle: Grid Layout (Intro - Image - Name) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative mt-4 mb-4 pb-20 md:pb-32">

                    {/* Left: One Line Intro */}
                    <div className="order-2 md:order-1 text-center md:text-left flex flex-col justify-center">
                        {member.github_url && (
                            <motion.a
                                href={member.github_url}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                                className="mb-4 inline-flex items-center justify-center md:justify-start opacity-70 hover:opacity-100 transition-opacity"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Github className="w-8 h-8 text-white drop-shadow-md" />
                            </motion.a>
                        )}
                        <motion.h3
                            className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight break-keep drop-shadow-lg"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {member.one_line_intro?.split('\n').map((line, i) => (
                                <span key={i} className="block">{line}</span>
                            )) || "Hello\nWorld"}
                        </motion.h3>
                    </div>

                    {/* Center: Image */}
                    <div className="order-1 md:order-2 relative h-[300px] md:h-full flex items-center justify-center pb-12 md:pb-24">
                        <motion.div
                            className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] group/image"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {/* 3D Convex Sphere Effect (Stronger Lensing) */}
                            <div className="absolute inset-0 rounded-full z-20 pointer-events-none shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_10px_10px_30px_rgba(255,255,255,0.5),0_20px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/10" />

                            {/* Specular Highlight (The 'Gloss') */}
                            <div className="absolute top-[8%] left-[25%] w-[40%] h-[25%] bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[6px] z-30 pointer-events-none" />

                            {/* Bottom Edge Reflection (Bounce Light) */}
                            <div className="absolute bottom-[5%] w-[60%] h-[20%] left-[20%] bg-gradient-to-t from-white/30 to-transparent rounded-full blur-[8px] z-20 pointer-events-none" />

                            <Image
                                src={member.thumbnail_url || "/tucode-pamoja-logo.png"}
                                alt={member.name}
                                fill
                                className="object-cover rounded-full z-10"
                            />

                            {/* Representative Project Badge - Premium Trophy Style */}
                            {member.representative_project && (
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-40">
                                    {projectUrl ? (
                                        <Link
                                            href={projectUrl}
                                            onClick={(e) => e.stopPropagation()}
                                            className="group/badge relative block"
                                        >
                                            <motion.div
                                                className="bg-black/60 backdrop-blur-md border border-white/10 text-white pl-2 pr-6 py-2 rounded-full flex items-center gap-3 shadow-xl hover:bg-black/80 hover:scale-105 transition-all outline outline-1 outline-white/5 hover:outline-white/20 min-w-[180px]"
                                                initial={{ y: 10, opacity: 0, scale: 0.9 }}
                                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border border-yellow-200/30 flex-shrink-0">
                                                    <Trophy className="w-4 h-4 text-black/90" />
                                                </div>
                                                <div className="flex flex-col items-start leading-none gap-0.5">
                                                    <span className="text-[9px] text-yellow-500/90 font-bold tracking-widest uppercase">Main Project</span>
                                                    <span className="text-xs font-bold text-white/90">{member.representative_project}</span>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ) : (
                                        <motion.div
                                            className="bg-black/60 backdrop-blur-md border border-white/10 text-white pl-2 pr-6 py-2 rounded-full flex items-center gap-3 shadow-xl cursor-default min-w-[180px]"
                                            initial={{ y: 10, opacity: 0, scale: 0.9 }}
                                            whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border border-yellow-200/30 flex-shrink-0">
                                                <Trophy className="w-4 h-4 text-black/90" />
                                            </div>
                                            <div className="flex flex-col items-start leading-none gap-0.5">
                                                <span className="text-[9px] text-yellow-500/90 font-bold tracking-widest uppercase">Main Project</span>
                                                <span className="text-xs font-bold text-white/90">{member.representative_project}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right: Name + Tech Stacks */}
                    <div className="order-3 md:order-3 text-center md:text-right flex flex-col justify-center items-center md:items-end">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black tracking-tighter text-white drop-shadow-lg">
                                {member.name}
                            </h2>
                            {/* Tech Stacks */}
                            {member.tags && member.tags.length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-4 max-w-[300px]">
                                    {member.tags.slice(0, 5).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium border border-white/5"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Footer: Short Message */}
                <div className="absolute bottom-8 md:bottom-8 left-0 w-full text-center z-20">
                    <div className="inline-block bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                        <p className="text-white/90 text-sm md:text-lg font-medium">
                            {member.short_message || member.bio?.slice(0, 100)}
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
