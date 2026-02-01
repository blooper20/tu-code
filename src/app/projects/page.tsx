"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProjectCard from "@/components/projects/project-card";
import { useInfiniteProjects } from "@/hooks/use-infinite-projects";
import InfiniteScrollTrigger from "@/components/ui/infinite-scroll-trigger";
import CategoryFilter from "@/components/ui/category-filter";

export default function ProjectsPage() {
    const { projects, loading, loadingMore, hasMore, loadMore, category, setCategory } = useInfiniteProjects();

    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="fixed top-0 -z-10 h-full w-full bg-[#050508] overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/projects-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/10 via-[#050508]/40 to-[#050508]/80" />
            </div>

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-4 text-white uppercase italic">
                            Our<br />Archive
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full mx-auto md:mx-0" />
                    </div>

                    <CategoryFilter
                        categories={["Web", "App", "AI", "Game", "Design", "Other"]}
                        selectedCategory={category}
                        onSelectCategory={setCategory}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] animate-pulse bg-white/5 rounded-[2rem] border border-white/5" />
                        ))}
                    </div>
                )}

                {!loading && projects.length === 0 && (
                    <div className="card text-center py-24 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
                        <p className="text-text-secondary text-lg mb-4">아직 전시된 프로젝트가 없습니다.</p>
                        <Link href="/admin" className="btn-premium px-8 py-3 text-sm inline-flex">
                            첫 프로젝트 등록하기 &rarr;
                        </Link>
                    </div>
                )}

                <InfiniteScrollTrigger
                    onTrigger={loadMore}
                    loading={loadingMore}
                    hasMore={hasMore}
                />
            </main>
        </div>
    );
}
