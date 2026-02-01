import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { Github, Calendar, User, ArrowLeft, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import MarkdownRenderer from "@/components/projects/markdown-renderer";
import Navbar from "@/components/layout/navbar";

interface ProjectPageProps {
    params: {
        id: string;
    };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
    const { id } = await params;

    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Header */}
            <section className="relative pt-32 pb-20 w-full overflow-hidden border-b border-surface-3">
                {/* Background Decorative Blur */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-6xl aspect-[2/1] bg-primary-500/10 blur-[120px] rounded-full" />

                <div className="container relative z-20 mx-auto px-6">
                    <Link
                        href="/#projects"
                        className="mb-8 inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors group text-sm font-mono"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        GO BACK TO ARCHIVE
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 tracking-tight leading-none">
                                {project.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-sm text-text-secondary font-medium">
                                <div className="flex items-center gap-2 bg-surface-1 py-1.5 px-3 rounded-lg border border-surface-3">
                                    <Calendar className="h-4 w-4 text-primary-400" />
                                    {new Date(project.created_at).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 bg-surface-1 py-1.5 px-3 rounded-lg border border-surface-3">
                                    <User className="h-4 w-4 text-accent-400" />
                                    {project.created_by || "Main Contributor"}
                                </div>
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        className="flex items-center gap-2 bg-primary-500/10 text-primary-400 py-1.5 px-3 rounded-lg border border-primary-500/20 hover:bg-primary-500/20 transition-all font-bold"
                                    >
                                        <Github className="h-4 w-4" />
                                        GitHub
                                    </a>
                                )}
                                {project.website_url && (
                                    <a
                                        href={project.website_url}
                                        target="_blank"
                                        className="flex items-center gap-2 bg-accent-500/10 text-accent-400 py-1.5 px-3 rounded-lg border border-accent-500/20 hover:bg-accent-500/20 transition-all font-bold"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Website
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end lg:pb-2">
                            <div className="flex flex-wrap gap-2">
                                {project.tags?.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 bg-surface-2/50 border border-surface-3 rounded-full text-xs font-mono uppercase tracking-wider text-text-primary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Article Section */}
                    <div className="lg:col-span-8">
                        <div className="relative">
                            {/* Sticky Sidebar decoration for large screens */}
                            <div className="hidden xl:block absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-surface-3 to-transparent" />

                            {/* Custom Rich Text Content */}
                            {project.custom_content && (
                                <div className="prose prose-invert max-w-none mb-16">
                                    <div dangerouslySetInnerHTML={{ __html: project.custom_content }} />
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-surface-3 to-transparent my-12" />
                                </div>
                            )}

                            {project.readme_content ? (
                                <MarkdownRenderer content={project.readme_content} />
                            ) : (
                                !project.custom_content && (
                                    <div className="card text-center py-32 bg-surface-1/20 border-dashed border-2 border-surface-3 rounded-3xl">
                                        <p className="text-text-muted text-lg">No content available for this project.</p>
                                        <p className="text-sm text-text-secondary mt-2">Add a README on GitHub or write a custom description in the dashboard.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <aside className="lg:col-span-4 space-y-10">
                        <div className="card p-8 border border-surface-3 bg-surface-1/30 backdrop-blur-md rounded-3xl">
                            <h3 className="text-xl font-bold mb-6 font-display flex items-center gap-2 text-white">
                                <Globe className="h-5 w-5 text-accent-400" />
                                Executive Summary
                            </h3>
                            <p className="text-text-secondary text-base leading-relaxed mb-6 italic">
                                "{project.description || "Project summary currently unavailable."}"
                            </p>

                            <div className="pt-6 border-t border-surface-3">
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl group"
                                >
                                    Explore Codebase
                                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-white/10">
                            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-[0.2em]">Contact Author</h4>
                            <p className="text-text-secondary text-sm mb-4">Interested in this project or want to collaborate?</p>
                            <div className="h-px w-full bg-white/10 my-4" />
                            <button className="text-white text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
                                Send a Message &rarr;
                            </button>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-white/5 py-20 text-center text-text-muted">
                <div className="container mx-auto px-6">
                    <p className="text-[10px] font-mono tracking-[0.5em] uppercase mb-4">Code Together, Vibe Forever</p>
                    <p className="text-xs opacity-50">&copy; 2024 TUCODE PAMOJA. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
}
