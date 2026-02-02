"use client";


import { createProject } from "@/lib/actions";
import { Github, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ui/image-picker";
import RichTextEditor from "@/components/editor/rich-text-editor";

export default function NewProjectPage() {
    const [loading, setLoading] = useState(false);
    const [customContent, setCustomContent] = useState("");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            // Rich Text Content 추가
            formData.append("custom_content", customContent);

            const result = await createProject(formData);
            if (result?.error) {
                alert(`에러: ${result.error}`);
            } else {
                router.push("/admin/projects");
            }
        } catch (error) {
            console.error(error);
            alert("프로젝트 생성 중 예상치 못한 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto max-w-2xl pb-20">
            <Link
                href="/admin/projects"
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                목록으로 돌아가기
            </Link>

            <h1 className="text-3xl font-bold mb-8">새 프로젝트 등록</h1>

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">프로젝트 제목</label>
                    <input
                        name="title"
                        required
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="예: Tucode Pamoja"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">설명</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all resize-none"
                        placeholder="프로젝트에 대한 간단한 설명을 입력하세요."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">카테고리</label>
                    <select
                        name="category"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all appearance-none"
                        defaultValue="Web"
                    >
                        <option value="Web">Web</option>
                        <option value="App">App</option>
                        <option value="MCP">MCP</option>
                        <option value="LLM">LLM</option>
                        <option value="AI">AI</option>
                        <option value="Game">Game</option>
                        <option value="Design">Design</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <ImagePicker name="thumbnail" label="프로젝트 썸네일 (선택사항)" />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">상세 내용 (Rich Text)</label>
                    <RichTextEditor
                        content={customContent}
                        onChange={setCustomContent}
                        placeholder="프로젝트에 대한 자세한 내용을 자유롭게 작성하세요 (이미지, 영상 포함 가능)"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">웹사이트 URL (선택사항)</label>
                    <div className="relative">
                        <input
                            name="website_url"
                            type="url"
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">배포 상태</label>
                    <select
                        name="deployment_status"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all appearance-none"
                        defaultValue="live"
                    >
                        <option value="live">🟢 Live (배포 완료)</option>
                        <option value="building">🟡 Building (배포 중)</option>
                        <option value="offline">🔴 Offline (중단됨)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">GitHub URL</label>
                    <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            name="github_url"
                            type="url"
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 pl-12 pr-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="https://github.com/username/repo"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">태그 (쉼표로 구분)</label>
                    <input
                        name="tags"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="React, Next.js, Supabase"
                    />
                </div>

                <button
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "프로젝트 생성하기"
                    )}
                </button>
            </form>
        </div>
    );
}
