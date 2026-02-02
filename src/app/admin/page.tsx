import { auth } from "@/lib/auth";

import { FolderGit2, Plus, Users, Star, ArrowUpRight, Zap, Target, Activity, Mail, Rocket, Hammer, AlertOctagon, Layers } from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getUnreadProjectMessageCount, getUnreadPersonalMessageCount } from "@/lib/actions/message";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await auth();

    // Fetch all data for calculations
    const { data: allProjects } = await supabaseAdmin
        .from("projects")
        .select("id, deployment_status, created_at");

    const { data: allTeamMembers } = await supabaseAdmin
        .from("team_members")
        .select("id, created_at");

    // Calculate Counts & Trends
    const now = new Date();
    const oneMonthAgo = new Date(new Date().setMonth(now.getMonth() - 1));

    const getTrend = (items: any[]) => {
        if (!items) return "0%";
        const current = items.length;
        const previous = items.filter(i => new Date(i.created_at) < oneMonthAgo).length;

        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const percent = ((current - previous) / previous) * 100;
        return `${percent > 0 ? '+' : ''}${percent.toFixed(0)}%`;
    };

    // 1. Projects Breakdown
    const normalize = (status: string) => status?.toLowerCase() || '';

    const liveProjects = allProjects?.filter(p => ['live', 'active', 'success', 'production'].includes(normalize(p.deployment_status))) || [];
    const buildingProjects = allProjects?.filter(p => ['building', 'deploying', 'pending', 'processing'].includes(normalize(p.deployment_status))) || [];
    const stoppedProjects = allProjects?.filter(p => ['stopped', 'failed', 'archived', 'maintenance', 'error'].includes(normalize(p.deployment_status))) || [];

    // 2. Views Calculations
    const totalViews = 0; // View count column likely missing, defaulting to 0
    const avgViews = allProjects?.length ? Math.round(totalViews / allProjects.length) : 0;

    // 3. Unread Messages
    const unreadProjectCount = await getUnreadProjectMessageCount();
    const unreadPersonalCount = await getUnreadPersonalMessageCount();

    // 4. Team Count
    const teamCount = allTeamMembers?.length || 0;

    const stats = [
        {
            label: "프로젝트 문의 (안 읽음)",
            value: unreadProjectCount,
            icon: Mail,
            color: "from-orange-500/20 to-orange-500/5",
            iconColor: "text-orange-500",
            description: "새로운 프로젝트 메시지",
            highlight: unreadProjectCount > 0,
            trend: null
        },
        {
            label: "개인 문의 (안 읽음)",
            value: unreadPersonalCount,
            icon: Mail,
            color: "from-pink-500/20 to-pink-500/5",
            iconColor: "text-pink-500",
            description: "팀원에게 도착한 메시지",
            highlight: unreadPersonalCount > 0,
            trend: null
        },
        {
            label: "총 조회수",
            value: totalViews.toLocaleString(),
            icon: Activity,
            color: "from-purple-500/20 to-purple-500/5",
            iconColor: "text-purple-500",
            description: "전체 포트폴리오 노출",
            trend: "+0%" // Views history not available
        },
        {
            label: "팀원",
            value: teamCount,
            icon: Users,
            color: "from-emerald-500/20 to-emerald-500/5",
            iconColor: "text-emerald-500",
            description: "함께하는 동료들",
            trend: getTrend(allTeamMembers || [])
        },
        {
            label: "총 프로젝트 수",
            value: allProjects?.length || 0,
            icon: Layers,
            color: "from-cyan-500/20 to-cyan-500/5",
            iconColor: "text-cyan-500",
            description: "등록된 전체 프로젝트",
            trend: getTrend(allProjects || [])
        },
        {
            label: "배포 중인 프로젝트",
            value: liveProjects.length,
            icon: Rocket,
            color: "from-green-500/20 to-green-500/5",
            iconColor: "text-green-500",
            description: "정상 서비스 중",
            trend: getTrend(liveProjects)
        },
        {
            label: "빌드 중인 프로젝트",
            value: buildingProjects.length,
            icon: Hammer,
            color: "from-blue-500/20 to-blue-500/5",
            iconColor: "text-blue-500",
            description: "배포/빌드 진행 중",
            trend: getTrend(buildingProjects)
        },
        {
            label: "중단된 프로젝트",
            value: stoppedProjects.length,
            icon: AlertOctagon,
            color: "from-red-500/20 to-red-500/5",
            iconColor: "text-red-500",
            description: "서비스 일시 중지",
            trend: getTrend(stoppedProjects)
        },
    ];

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center space-y-6 py-2">
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

            {/* Visual Stats Grid - Flexible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stats.map((stat, index) => ( // 8th item (empty) handled by flow or add another? 7 items fit nicely in 4 cols (last one empty)
                    <div key={index} className={`relative overflow-hidden rounded-[2rem] bg-surface-1 border ${stat.highlight ? 'border-primary-500/50 shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.3)]' : 'border-white/5'} p-5 group hover:border-white/10 transition-all duration-500`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[100px]">
                            <div className="flex justify-between items-start">
                                <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
                                {stat.trend && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-text-secondary bg-white/5'}`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mt-4">{stat.value}</h3>
                                <p className="text-[11px] font-medium text-text-muted mt-1">{stat.label}</p>
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
