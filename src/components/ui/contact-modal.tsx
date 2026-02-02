"use client";

import { useState } from "react";
import { Send, X, Mail, Loader2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessage } from "@/lib/actions/message";

interface ContactModalProps {
    projectId?: string;
    projectTitle?: string;
    teamMemberId?: string;
    recipientName?: string;
    trigger?: React.ReactNode;
}

export default function ContactModal({
    projectId,
    projectTitle,
    teamMemberId,
    recipientName,
    trigger
}: ContactModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSending(true);
        if (projectId) formData.append("project_id", projectId);
        if (teamMemberId) formData.append("team_member_id", teamMemberId);

        const result = await sendMessage(formData);

        setIsSending(false);
        if (result?.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
            }, 2000);
        } else {
            alert(result?.error || "오류가 발생했습니다.");
        }
    }

    const displayName = recipientName || (projectTitle ? `Team ${projectTitle}` : "Unknown");

    return (
        <>
            {trigger ? (
                <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-white text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity group w-full"
                >
                    Send a Message
                    <Mail className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="bg-[#2a2a2a] px-4 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <span className="ml-2 text-xs font-medium text-white/70">New Message</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Body */}
                        {isSuccess ? (
                            <div className="p-8 flex flex-col items-center justify-center text-center h-[300px]">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500">
                                    <Send className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">전송 완료!</h3>
                                <p className="text-text-secondary">
                                    소중한 메시지가 전달되었습니다.<br />
                                    빠른 시일 내에 답변 드리겠습니다.
                                </p>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">To</label>
                                    <div className="text-sm text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                        {displayName}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">From (Your Email)</label>
                                    <input
                                        name="sender_email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full bg-black/30 text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-primary-500 outline-none transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">Message</label>
                                    <textarea
                                        name="content"
                                        required
                                        rows={6}
                                        placeholder="문의나 제안 내용을 자유롭게 남겨주세요."
                                        className="w-full bg-black/30 text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-primary-500 outline-none transition-colors resize-none placeholder:text-white/20 custom-scrollbar"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            전송하기
                                            <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
