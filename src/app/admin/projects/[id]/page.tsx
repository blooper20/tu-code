"use client";


import { updateProject, refreshProjectReadme } from "@/lib/actions";
import { getProjectMessages } from "@/lib/actions/message";
import { supabase } from "@/lib/supabase/client";
import { Github, ArrowLeft, Loader2, RefreshCw, Star, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import ImagePicker from "@/components/ui/image-picker";
import RichTextEditor from "@/components/editor/rich-text-editor";

interface EditProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [customContent, setCustomContent] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchProject() {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                router.push("/admin/projects");
                return;
            }

            setProject(data);
            setCustomContent(data.custom_content || "");

            // Fetch messages
            const msgs = await getProjectMessages(id);
            if (msgs) setMessages(msgs);

            setLoading(false);
        }
        fetchProject();
    }, [id, router]);

    async function handleSubmit(formData: FormData) {
        setSaving(true);
        try {
            // Rich Text Content 추가
            formData.append("custom_content", customContent);

            const result = await updateProject(id, formData);
            if (result?.error) {
                alert(`에러: ${result.error}`);
            } else {
                router.push("/admin/projects");
            }
        } catch (error) {
            console.error(error);
            alert("프로젝트 수정 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    }

    async function handleRefreshReadme() {
        setRefreshing(true);
        try {
            const result = await refreshProjectReadme(id);
            if (result?.error) {
                alert(`에러: ${result.error}`);
            } else {
                alert("README가 성공적으로 업데이트되었습니다.");
                // 프로젝트 데이터 새로고침
                const { data } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("id", id)
                    .single();
                if (data) setProject(data);
            }
        } catch (error) {
            alert("README 업데이트 중 오류가 발생했습니다.");
        } finally {
            setRefreshing(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
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

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">프로젝트 편집</h1>
                {project.github_url && (
                    <button
                        onClick={handleRefreshReadme}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-surface-2 hover:bg-surface-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        README 새로고침
                    </button>
                )}
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">프로젝트 제목</label>
                    <input
                        name="title"
                        required
                        defaultValue={project.title}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">설명</label>
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={project.description || ""}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">카테고리</label>
                    <select
                        name="category"
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all appearance-none"
                        defaultValue={project.category || "Web"}
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

                <ImagePicker name="thumbnail" label="프로젝트 썸네일" defaultValue={project.thumbnail_url} />

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
                            defaultValue={project.website_url || ""}
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
                        defaultValue={project.deployment_status || "live"}
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
                            defaultValue={project.github_url || ""}
                            className="w-full rounded-xl border border-surface-3 bg-surface-1 pl-12 pr-4 py-3 outline-none focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">태그 (쉼표로 구분)</label>
                    <input
                        name="tags"
                        defaultValue={project.tags?.join(", ") || ""}
                        className="w-full rounded-xl border border-surface-3 bg-surface-1 px-4 py-3 outline-none focus:border-primary-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 p-4 bg-surface-1 rounded-xl border border-surface-3">
                    <input
                        type="checkbox"
                        name="is_featured"
                        id="is_featured"
                        value="true"
                        defaultChecked={project.is_featured}
                        className="h-5 w-5 rounded border-surface-3 text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="is_featured" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Featured 프로젝트로 설정
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "변경사항 저장"
                        )}
                    </button>
                    <Link
                        href={`/projects/${project.id}`}
                        target="_blank"
                        className="px-6 py-4 bg-surface-2 hover:bg-surface-3 rounded-xl transition-colors text-text-secondary"
                    >
                        미리보기
                    </Link>
                </div>
            </form>

            {/* Messages Inbox Section */}
            <div className="mt-16 pt-10 border-t border-surface-3">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-primary-500" />
                    수신된 메시지함 (Inbox)
                </h2>

                {messages.length === 0 ? (
                    <div className="card p-8 text-center bg-surface-1 border-dashed border-2 border-surface-3 rounded-2xl">
                        <p className="text-text-muted">아직 도착한 메시지가 없습니다.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="card p-6 bg-surface-1 border border-surface-3 rounded-2xl hover:border-primary-500/30 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary-500 font-bold">
                                            {msg.sender_email.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary">{msg.sender_email}</p>
                                            <div className="flex items-center gap-1 text-xs text-text-muted">
                                                <Clock className="h-3 w-3" />
                                                {new Date(msg.created_at).toLocaleString('ko-KR')}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${msg.status === 'unread' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                        {msg.status === 'unread' ? '읽지 않음' : '읽음'}
                                    </span>
                                </div>
                                <div className="pl-13 text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
