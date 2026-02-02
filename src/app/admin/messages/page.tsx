"use client";

import { useEffect, useState } from "react";
import { getAllMessages } from "@/lib/actions/message";
import { Mail, Clock, Search, Filter, RefreshCw, Folder, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread, read
    const [activeTab, setActiveTab] = useState("project"); // 'project' | 'personal'
    const router = useRouter();

    async function fetchMessages() {
        setLoading(true);
        const data = await getAllMessages();
        if (data) setMessages(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter(msg => {
        // Status filter
        if (filter !== "all" && msg.status !== filter) return false;

        // Tab filter
        if (activeTab === "project") {
            return !!msg.project_id;
        } else {
            return !!msg.team_member_id;
        }
    });

    return (
        <div className="container mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Mail className="h-8 w-8 text-primary-500" />
                        메시지함
                    </h1>
                    <p className="text-text-secondary mt-1">
                        전체 프로젝트 및 팀원 문의 메시지를 관리합니다.
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-3 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    새로고침
                </button>
            </div>

            <div className="flex items-center gap-4 border-b border-surface-3 mb-6">
                <button
                    onClick={() => setActiveTab("project")}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'project' ? 'border-primary-500 text-white' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    프로젝트 문의
                </button>
                <button
                    onClick={() => setActiveTab("personal")}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'personal' ? 'border-primary-500 text-white' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    팀원 개인 문의
                </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white text-black' : 'bg-surface-2 text-text-secondary hover:bg-surface-3'}`}
                >
                    전체
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-white text-black' : 'bg-surface-2 text-text-secondary hover:bg-surface-3'}`}
                >
                    안 읽음
                </button>
                <button
                    onClick={() => setFilter("read")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'read' ? 'bg-white text-black' : 'bg-surface-2 text-text-secondary hover:bg-surface-3'}`}
                >
                    읽음
                </button>
            </div>

            {loading && messages.length === 0 ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-surface-1 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-1 rounded-3xl border border-surface-3 border-dashed">
                    <Mail className="h-12 w-12 text-text-muted mb-4 opacity-50" />
                    <p className="text-text-secondary text-lg font-medium">메시지가 없습니다.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => router.push(`/admin/messages/${msg.id}`)}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${msg.status === 'unread'
                                ? 'bg-surface-1 border-primary-500/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]'
                                : 'bg-surface-1/50 border-surface-3 opacity-80 hover:opacity-100'
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${msg.status === 'unread'
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                            : 'bg-surface-3 text-text-secondary'
                                            }`}>
                                            {msg.sender_email.slice(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-white">
                                                    {msg.sender_email}
                                                </h3>
                                                {msg.status === 'unread' && (
                                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                                                {msg.projects ? (
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-2 border border-surface-3">
                                                        <Folder className="h-3 w-3" />
                                                        {msg.projects.title}
                                                    </span>
                                                ) : msg.team_members ? (
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                        <User className="h-3 w-3" />
                                                        To: {msg.team_members.name}
                                                    </span>
                                                ) : null}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(msg.created_at).toLocaleString('ko-KR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        {msg.project_id && (
                                            <Link
                                                href={`/admin/projects/${msg.project_id}`}
                                                className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-sm font-medium transition-colors text-text-secondary hover:text-white"
                                            >
                                                프로젝트 보기
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="pl-16">
                                    <p className="text-text-secondary leading-relaxed whitespace-pre-wrap line-clamp-2">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
