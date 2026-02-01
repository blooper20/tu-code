"use client";

import { createTeamMember } from "@/lib/actions";
import { Github, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ui/image-picker";
import RichTextEditor from "@/components/editor/rich-text-editor";

export default function NewTeamMemberPage() {
    const [loading, setLoading] = useState(false);
    const [customContent, setCustomContent] = useState("");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            formData.append("custom_content", customContent);

            const result = await createTeamMember(formData);
            if (result?.error) {
                alert(`에러: ${result.error}`);
            } else {
                router.push("/admin/team");
            }
        } catch (error) {
            console.error(error);
            alert("멤버 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto max-w-2xl pb-20">
            <Link
                href="/admin/team"
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                목록으로 돌아가기
            </Link>

            <h1 className="text-3xl font-bold mb-8">새 멤버 등록</h1>

            <form action={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-surface-2 rounded-xl mb-6">
                    <input
                        type="checkbox"
                        name="use_github_data"
                        value="true"
                        id="use_github_data"
                        defaultChecked
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="use_github_data" className="text-sm font-medium text-text-primary cursor-pointer">
                        GitHub 데이터 자동 동기화 (프로필, 이미지, Bio)
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">GitHub URL</label>
                    <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            name="github_url"
                            type="url"
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 pl-12 pr-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="https://github.com/username (동기화 시 필수)"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">이름 (Name)</label>
                        <input
                            name="name"
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="이름 입력 (GitHub 동기화 시 자동)"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">포지션 (Role)</label>
                        <input
                            name="role"
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="예: Backend Developer"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">한줄 소개 (One Line Intro - 카드 왼쪽)</label>
                    <input
                        name="one_line_intro"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="예: Conquiste\no amanhã (줄바꿈 가능)"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">짧은 메시지 (Short Message - 카드 하단)</label>
                    <input
                        name="short_message"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="예: Encurte o caminho..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">대표 프로젝트명 (Under Image)</label>
                    <input
                        name="representative_project"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="예: TOSS Clone"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">배경 색상</label>
                        <div className="flex items-center gap-4">
                            <input
                                name="background_color"
                                type="color"
                                defaultValue="#3b82f6"
                                className="h-12 w-24 rounded-lg cursor-pointer border border-surface-3"
                            />
                            <span className="text-xs text-text-muted">카드 배경색</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">기술 스택</label>
                        <input
                            name="tags"
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="React, Node.js"
                        />
                    </div>
                </div>

                <ImagePicker name="background_image" label="배경 이미지 (선택)" />
                <ImagePicker name="thumbnail" label="프로필 이미지 (선택 - GitHub 기본값 사용 가능)" />

                {/* Legacy Bio Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">기본 Bio (GitHub Bio)</label>
                    <textarea
                        name="bio"
                        rows={2}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all resize-none"
                        placeholder="GitHub에서 불러오지 않을 경우 사용됩니다."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">상세 소개 (Rich Text)</label>
                    <RichTextEditor
                        content={customContent}
                        onChange={setCustomContent}
                        placeholder="자유롭게 본인을 소개하세요."
                    />
                </div>

                <button
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "멤버 등록하기"
                    )}
                </button>
            </form>
        </div>
    );
}
