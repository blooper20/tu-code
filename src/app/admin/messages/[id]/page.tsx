"use client";

import { useEffect, useState, use } from "react";
import { getMessageById, updateMessageStatus } from "@/lib/actions/message";
import { ArrowLeft, Clock, Folder, Mail, User, Trash2, Reply } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [message, setMessage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadMessage() {
            setLoading(true);
            const data = await getMessageById(id);
            if (data) {
                setMessage(data);
                // If unread, mark as read
                if (data.status === 'unread') {
                    await updateMessageStatus(id, 'read');
                    router.refresh();
                }
            }
            setLoading(false);
        }
        loadMessage();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto py-10 animate-pulse space-y-8">
                <div className="h-8 w-32 bg-surface-2 rounded-lg" />
                <div className="h-64 bg-surface-1 rounded-3xl" />
            </div>
        );
    }

    if (!message) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold text-text-primary">메시지를 찾을 수 없습니다.</h2>
                <Link href="/admin/messages" className="text-primary-500 hover:underline mt-4 inline-block">
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto pb-20 max-w-4xl">
            <Link
                href="/admin/messages"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                메시지 목록으로
            </Link>

            <div className="bg-surface-1 border border-surface-3 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-8 border-b border-surface-3 bg-surface-2/30">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-2xl font-bold text-primary-400 border border-white/5">
                                {message.sender_email.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{message.sender_email}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                                    <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(message.created_at).toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>

                                    {message.projects ? (
                                        <span className="flex items-center gap-1.5 bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full border border-primary-500/20">
                                            <Folder className="h-3.5 w-3.5" />
                                            {message.projects.title}
                                        </span>
                                    ) : message.team_members ? (
                                        <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                                            <User className="h-3.5 w-3.5" />
                                            To: {message.team_members.name}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={`mailto:${message.sender_email}`}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20"
                            >
                                <Reply className="h-4 w-4" />
                                답장하기
                            </a>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 min-h-[400px] bg-[#0A0A0F]">
                    <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-p:leading-loose text-lg">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-surface-3 bg-surface-2/30 flex justify-between items-center">
                    <div className="text-sm text-text-muted">
                        Message ID: <span className="font-mono opacity-50">{message.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
