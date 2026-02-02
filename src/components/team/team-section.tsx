"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X, Code2, Mail } from "lucide-react";
import { getTeamMembers, getProjects } from "@/lib/actions";
import MarkdownRenderer from "@/components/projects/markdown-renderer";
import TeamCardPremium, { TeamMember } from "@/components/team/team-card-premium";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/projects/project-card";
import ContactModal from "@/components/ui/contact-modal";

export default function TeamSection() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const memberId = searchParams.get("memberId");

    const selectedMember = members.find(m => m.id === memberId) || null;

    useEffect(() => {
        Promise.all([
            getTeamMembers(),
            getProjects()
        ]).then(([membersData, projectsData]) => {
            if (membersData) setMembers(membersData);
            if (projectsData) setProjects(projectsData);
        });
    }, []);

    const handleOpen = (member: TeamMember) => {
        router.push(`?memberId=${member.id}`, { scroll: false });
    };

    const handleClose = () => {
        router.push("/team", { scroll: false });
    };

    if (members.length === 0) return null;

    return (
        <section id="team" className="relative z-10 w-full max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-4 text-white uppercase italic">
                    The<br />Creators
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full mx-auto" />
                <p className="mt-6 text-text-secondary max-w-2xl mx-auto">
                    우리는 코드로 연결된 하나의 팀입니다.<br />
                    각자의 색깔로 더 나은 세상을 그려나가는 메이커들을 소개합니다.
                </p>
            </div>

            <div className="flex flex-col gap-12">
                {members.map((member) => {
                    const repProject = projects.find(p => p.title === member.representative_project);
                    const projectUrl = repProject ? `/projects/${repProject.id}` : undefined;

                    return (
                        <TeamCardPremium
                            key={member.id}
                            member={member}
                            onClick={() => handleOpen(member)}
                            projectUrl={projectUrl}
                        />
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedMember && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                            onClick={handleClose}
                        />
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                layoutId={`card-${selectedMember.id}`}
                                className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0F] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="relative h-48 sm:h-64 shrink-0">
                                    {selectedMember.thumbnail_url ? (
                                        <img
                                            src={selectedMember.thumbnail_url}
                                            alt={selectedMember.name}
                                            className="w-full h-full object-cover opacity-50"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-surface-2" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent" />

                                    <button
                                        onClick={handleClose}
                                        className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors backdrop-blur-md"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="absolute bottom-6 left-6 sm:left-10">
                                        <h2 className="text-4xl font-bold text-white mb-2">{selectedMember.name}</h2>
                                        <p className="text-xl text-pink-400 font-medium mb-4">{selectedMember.role}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMember.tags?.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm text-white/90">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 right-6 sm:right-10 flex gap-3">
                                        <ContactModal
                                            teamMemberId={selectedMember.id}
                                            recipientName={selectedMember.name}
                                            trigger={
                                                <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all backdrop-blur-md group relative">
                                                    <Mail className="w-5 h-5" />
                                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                        Send Message
                                                    </span>
                                                </button>
                                            }
                                        />

                                        {selectedMember.github_url && (
                                            <a
                                                href={selectedMember.github_url}
                                                target="_blank"
                                                className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all backdrop-blur-md"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Content - Scrollable */}
                                <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                                    <div className="prose prose-invert max-w-none">
                                        {selectedMember.bio && (
                                            <div className="mb-10 text-lg text-text-secondary leading-relaxed font-light border-l-2 border-pink-500 pl-6 italic">
                                                "{selectedMember.bio}"
                                            </div>
                                        )}

                                        {selectedMember.custom_content && (
                                            <div className="mb-12">
                                                <div dangerouslySetInnerHTML={{ __html: selectedMember.custom_content }} />
                                            </div>
                                        )}

                                        {selectedMember.readme_content && (
                                            <div className="pt-10 border-t border-white/10">
                                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                                    <Code2 className="w-6 h-6 text-pink-500" />
                                                    GitHub Profile
                                                </h3>
                                                <div className="bg-surface-1 p-6 rounded-2xl border border-white/5">
                                                    <MarkdownRenderer content={selectedMember.readme_content} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Related Projects */}
                                        {projects.some(p =>
                                            selectedMember.related_project_ids?.includes(p.id) ||
                                            p.title === selectedMember.representative_project ||
                                            p.created_by === selectedMember.name
                                        ) && (
                                                <div className="pt-10 border-t border-white/10 mt-10">
                                                    <h3 className="text-2xl font-bold text-white mb-6">
                                                        Created Projects
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {projects.filter(p =>
                                                            selectedMember.related_project_ids?.includes(p.id) ||
                                                            p.created_by === selectedMember.name ||
                                                            p.title === selectedMember.representative_project
                                                        ).map(project => (
                                                            <ProjectCard key={project.id} project={project} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
