import { auth } from "@/lib/auth";
import { FolderGit2, Plus, Users, Star, ArrowUpRight, Zap, Target, Activity } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function AdminPage() {
    const session = await auth();

    // Fetch real stats
    const { count: projectCount } = await supabase
        .from("projects")
        .select("*", { count: 'exact', head: true });

    const stats = [
        {
            label: "활성 프로젝트",
            value: projectCount || 0,
            icon: FolderGit2,
            color: "from-orange-500/20 to-orange-500/5",
            iconColor: "text-orange-500",
            description: "현재 전시 중인 작업물"
        },
        {
            label: "팀원",
            value: "1",
            icon: Users,
            color: "from-pink-500/20 to-pink-500/5",
            iconColor: "text-pink-500",
            description: "함께하는 동료들"
        },
        {
            label: "총 조회수",
            value: "1,240",
            icon: Activity,
            color: "from-purple-500/20 to-purple-500/5",
            iconColor: "text-purple-500",
            description: "전체 포트폴리오 노출"
        },
    ];

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col justify-center space-y-6 py-2">
            {/* Hero Welcome Section - Compact */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-1 border border-white/5 p-8 lg:p-10">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 bg-primary-500/10 blur-[100px] rounded-full" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-primary-400 uppercase tracking-widest">
                        <Zap className="h-3 w-3" />
                        Admin Center
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
                        반가워요, <span className="brand-gradient-text">{session?.user?.name?.split(' ')[0]}님!</span><br />
                        오늘은 어떤 가치를 기록해볼까요?
                    </h1>
                </div>
            </div>

            {/* Visual Stats Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`relative overflow-hidden rounded-[2rem] bg-surface-1 border border-white/5 p-5 group hover:border-white/10 transition-all duration-500`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative z-10 flex flex-col h-full">
                            <stat.icon className={`h-7 w-7 ${stat.iconColor} mb-3`} />
                            <p className="text-[11px] font-medium text-text-muted">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                                <span className="text-[10px] text-green-500 font-bold">+12%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Action Tiles - Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Manage Projects Tile */}
                <Link href="/admin/projects" className="group relative overflow-hidden rounded-[2rem] bg-surface-1 border border-white/5 p-6 hover:border-orange-500/30 transition-all duration-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
                            <FolderGit2 className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">아카이빙 관리</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            팀의 결실을 세상에 보여줄 준비가 되셨나요?<br />
                            기존 프로젝트를 수정하거나 관리합니다.
                        </p>
                    </div>
                </Link>

                {/* Manage Team Tile */}
                <Link href="/admin/team" className="group relative overflow-hidden rounded-[2rem] bg-surface-1 border border-white/5 p-6 hover:border-pink-500/30 transition-all duration-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform duration-500">
                            <Users className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">팀원 관리</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            함께하는 동료들을 소개하세요.<br />
                            프로필과 기술 스택을 관리합니다.
                        </p>
                    </div>
                </Link>

                {/* Add New Tile */}
                <Link href="/admin/projects/new" className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 to-pink-600 p-1px hover:shadow-[0_0_40px_-12px_rgba(255,107,43,0.4)] transition-all duration-700 lg:col-span-2">
                    <div className="bg-surface-1 rounded-[calc(2rem-1px)] h-full p-6 group-hover:bg-transparent transition-colors duration-700">
                        <div className="flex justify-between items-start mb-6 text-white">
                            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-transform duration-500 group-hover:scale-110">
                                <Plus className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="group-hover:text-white transition-colors">
                            <h3 className="text-lg font-bold text-white mb-1">새로운 여정 시작</h3>
                            <p className="text-xs text-text-secondary group-hover:text-white/80 transition-colors leading-relaxed">
                                코드로 써내려간 또 하나의 기록을 보관할 시간입니다.<br />
                                고유한 팀의 온기를 프로젝트에 담아보세요.
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
