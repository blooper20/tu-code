"use client";

import { getTeamMember, updateTeamMember, getProjects } from "@/lib/actions";
import { Github, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ImagePicker from "@/components/ui/image-picker";
import RichTextEditor from "@/components/editor/rich-text-editor";

export default function EditTeamMemberPage() {
    const params = useParams();
    const id = params.id as string;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [customContent, setCustomContent] = useState("");
    const [member, setMember] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [hasBgImage, setHasBgImage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setInitialLoading(true);
        Promise.all([
            getTeamMember(id),
            getProjects()
        ]).then(([memberData, projectsData]) => {
            if (memberData) {
                setMember(memberData);
                setCustomContent(memberData.custom_content || "");
                setHasBgImage(!!memberData.background_image_url);
            } else {
                alert("멤버를 찾을 수 없습니다.");
                router.push("/admin/team");
            }
            if (projectsData) {
                setProjects(projectsData);
            }
            setInitialLoading(false);
        });
    }, [id, router]);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            formData.append("custom_content", customContent);

            const result = await updateTeamMember(id, formData);
            if (result?.error) {
                alert(`에러: ${result.error}`);
            } else {
                router.push("/admin/team");
            }
        } catch (error) {
            console.error(error);
            alert("멤버 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!member) return null;

    return (
        <div className="container mx-auto max-w-2xl pb-20">
            <Link
                href="/admin/team"
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                목록으로 돌아가기
            </Link>

            <h1 className="text-3xl font-bold mb-8">멤버 정보 수정: {member.name}</h1>

            <form action={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-surface-2 rounded-xl mb-6">
                    <input
                        type="checkbox"
                        name="use_github_data"
                        value="true"
                        id="use_github_data"
                        defaultChecked={member.use_github_data}
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
                            defaultValue={member.github_url}
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
                            defaultValue={member.name}
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="이름 입력"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">포지션 (Role)</label>
                        <input
                            name="role"
                            defaultValue={member.role}
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="예: Backend Developer"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">한줄 소개 (One Line Intro)</label>
                    <input
                        name="one_line_intro"
                        defaultValue={member.one_line_intro}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="예: 세상을 바꾸는 개발자 (줄바꿈 가능)"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">짧은 메시지 (Short Message)</label>
                    <input
                        name="short_message"
                        defaultValue={member.short_message}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                        placeholder="예: 함께 성장하는 즐거움"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">대표 프로젝트 (Representative Project)</label>
                    <div className="relative">
                        <select
                            name="representative_project"
                            defaultValue={member.representative_project}
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all appearance-none text-text-primary"
                        >
                            <option value="">선택 안 함</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.title}>{p.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">배경 색상</label>
                            <div className="flex items-center gap-4">
                                <input
                                    name="background_color"
                                    type="color"
                                    defaultValue={member.background_color || "#3b82f6"}
                                    className="h-12 w-24 rounded-lg cursor-pointer border border-surface-3"
                                />
                                <span className="text-xs text-text-muted">카드 배경색</span>
                            </div>
                        </div>

                        {/* Glassmorphism Checkbox */}
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${hasBgImage ? 'bg-surface-1 border-surface-3 opacity-50 cursor-not-allowed' : 'bg-surface-2 border-primary-500/30'
                            }`}>
                            <input
                                type="checkbox"
                                name="use_glassmorphism"
                                value="true"
                                id="use_glassmorphism"
                                defaultChecked={member.use_glassmorphism}
                                disabled={hasBgImage}
                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                            />
                            <div className="flex flex-col">
                                <label htmlFor="use_glassmorphism" className={`text-sm font-medium cursor-pointer ${hasBgImage ? 'text-text-muted cursor-not-allowed' : 'text-text-primary'}`}>
                                    글래스 모피즘 효과 (Glassmorphism)
                                </label>
                                <span className="text-xs text-text-muted">
                                    {hasBgImage ? "배경 이미지가 있으면 사용할 수 없습니다." : "배경색 위에 은은한 유리 질감을 추가합니다."}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">기술 스택</label>
                        <input
                            name="tags"
                            defaultValue={member.tags?.join(", ")}
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                            placeholder="React, Node.js"
                        />
                    </div>
                </div>

                <ImagePicker
                    name="background_image"
                    label="배경 이미지 (선택 시 글래스 효과 비활성)"
                    defaultValue={member.background_image_url}
                    onImageSet={() => setHasBgImage(true)}
                    onImageRemove={() => setHasBgImage(false)}
                />

                <ImagePicker
                    name="thumbnail"
                    label="프로필 이미지 (변경하려면 새 이미지 선택)"
                    defaultValue={member.thumbnail_url}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">기본 Bio</label>
                    <textarea
                        name="bio"
                        defaultValue={member.bio}
                        rows={2}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all resize-none"
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
                        "변경사항 저장"
                    )}
                </button>
            </form>
        </div>
    );
}
