# Anti-Gravity 미구현 기능 구현 가이드

> 마지막 업데이트: 2025-01-30

이 문서는 미구현된 기능들의 구체적인 구현 방법을 코드와 함께 제공합니다.

---

## 목차

1. [프로젝트 편집 기능 (Critical)](#1-프로젝트-편집-기능)
2. [무한 스크롤 (High)](#2-무한-스크롤)
3. [미디어 업로드 (High)](#3-미디어-업로드)
4. [프로젝트 순서 변경 (High)](#4-프로젝트-순서-변경)
5. [Rich Text Editor (Medium)](#5-rich-text-editor)
6. [UI 컴포넌트 분리 (Medium)](#6-ui-컴포넌트-분리)
7. [커스텀 훅 (Low)](#7-커스텀-훅)
8. [타입 정리 (Low)](#8-타입-정리)
9. [SEO 메타태그 (Low)](#9-seo-메타태그)
10. [Vercel 배포 (Low)](#10-vercel-배포)

---

## 1. 프로젝트 편집 기능

### 1.1 updateProject Server Action 추가

**파일:** `src/lib/actions.ts`

```typescript
// 기존 코드 아래에 추가

export async function updateProject(id: string, formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const github_url = formData.get("github_url") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
    const is_featured = formData.get("is_featured") === "true";

    // GitHub URL이 변경되었으면 README 다시 가져오기
    let readme_content: string | undefined;
    if (github_url) {
        const gitInfo = parseGitHubUrl(github_url);
        if (gitInfo) {
            const readmeData = await fetchGitHubReadme(gitInfo.owner, gitInfo.repo);
            if (readmeData) {
                readme_content = readmeData;
            }
        }
    }

    const updateData: any = {
        title,
        description,
        github_url,
        tags,
        is_featured,
        updated_at: new Date().toISOString(),
    };

    if (readme_content !== undefined) {
        updateData.readme_content = readme_content;
    }

    const { data, error } = await supabaseAdmin
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating project:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/");
    return { success: true, data };
}

export async function refreshProjectReadme(id: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // 현재 프로젝트의 GitHub URL 가져오기
    const { data: project } = await supabaseAdmin
        .from("projects")
        .select("github_url")
        .eq("id", id)
        .single();

    if (!project?.github_url) {
        return { error: "GitHub URL이 없습니다." };
    }

    const gitInfo = parseGitHubUrl(project.github_url);
    if (!gitInfo) {
        return { error: "유효하지 않은 GitHub URL입니다." };
    }

    const readme_content = await fetchGitHubReadme(gitInfo.owner, gitInfo.repo);

    const { error } = await supabaseAdmin
        .from("projects")
        .update({
            readme_content,
            updated_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/projects/${id}`);
    return { success: true };
}
```

### 1.2 프로젝트 편집 페이지

**파일:** `src/app/admin/projects/[id]/page.tsx`

```typescript
"use client";

import { updateProject, refreshProjectReadme } from "@/lib/actions";
import { supabase } from "@/lib/supabase/client";
import { Github, ArrowLeft, Loader2, RefreshCw, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditProjectPageProps {
    params: {
        id: string;
    };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchProject() {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error || !data) {
                router.push("/admin/projects");
                return;
            }

            setProject(data);
            setLoading(false);
        }
        fetchProject();
    }, [params.id, router]);

    async function handleSubmit(formData: FormData) {
        setSaving(true);
        try {
            const result = await updateProject(params.id, formData);
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
            const result = await refreshProjectReadme(params.id);
            if (result?.error) {
                alert(`에러: ${result.error}`);
            } else {
                alert("README가 성공적으로 업데이트되었습니다.");
                // 프로젝트 데이터 새로고침
                const { data } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("id", params.id)
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
        <div className="container mx-auto max-w-2xl">
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
        </div>
    );
}
```

### 1.3 프로젝트 목록에 편집 링크 추가

**파일:** `src/app/admin/projects/page.tsx` 수정 필요

프로젝트 목록에서 각 프로젝트에 "편집" 버튼 추가:

```typescript
// 프로젝트 카드/행에 추가
<Link
    href={`/admin/projects/${project.id}`}
    className="text-primary-500 hover:text-primary-400"
>
    편집
</Link>
```

---

## 2. 무한 스크롤

### 2.1 useInfiniteProjects 훅 생성

**파일:** `src/hooks/use-infinite-projects.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

const PAGE_SIZE = 9;

export function useInfiniteProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchProjects = useCallback(async (pageNum: number, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching projects:", error);
            return;
        }

        if (data) {
            if (append) {
                setProjects(prev => [...prev, ...data]);
            } else {
                setProjects(data);
            }
            setHasMore(data.length === PAGE_SIZE);
        }

        setLoading(false);
        setLoadingMore(false);
    }, []);

    useEffect(() => {
        fetchProjects(0);
    }, [fetchProjects]);

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage, true);
        }
    }, [page, loadingMore, hasMore, fetchProjects]);

    return {
        projects,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    };
}
```

### 2.2 InfiniteScrollTrigger 컴포넌트

**파일:** `src/components/ui/infinite-scroll-trigger.tsx`

```typescript
"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollTriggerProps {
    onTrigger: () => void;
    loading: boolean;
    hasMore: boolean;
}

export default function InfiniteScrollTrigger({
    onTrigger,
    loading,
    hasMore
}: InfiniteScrollTriggerProps) {
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onTrigger();
                }
            },
            { threshold: 0.1 }
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => observer.disconnect();
    }, [onTrigger, hasMore, loading]);

    if (!hasMore) return null;

    return (
        <div ref={triggerRef} className="flex justify-center py-8">
            {loading && (
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            )}
        </div>
    );
}
```

### 2.3 메인 페이지에 적용

**파일:** `src/app/page.tsx` 수정

```typescript
// 기존 useState, useEffect 대신:
import { useInfiniteProjects } from "@/hooks/use-infinite-projects";
import InfiniteScrollTrigger from "@/components/ui/infinite-scroll-trigger";

// 컴포넌트 내부:
const { projects, loading, loadingMore, hasMore, loadMore } = useInfiniteProjects();

// 프로젝트 그리드 하단에 추가:
<InfiniteScrollTrigger
    onTrigger={loadMore}
    loading={loadingMore}
    hasMore={hasMore}
/>
```

---

## 3. 미디어 업로드

### 3.1 Supabase Storage 버킷 생성

Supabase 대시보드에서:
1. Storage → New bucket → "project-media" 생성
2. Policies 설정:
   - `SELECT`: public (누구나 읽기)
   - `INSERT/UPDATE/DELETE`: authenticated users only

### 3.2 uploadMedia Server Action

**파일:** `src/lib/actions.ts`에 추가

```typescript
export async function uploadMedia(formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const projectId = formData.get("project_id") as string;

    if (!file) {
        return { error: "파일이 없습니다." };
    }

    // 파일 확장자 추출
    const ext = file.name.split(".").pop();
    const fileName = `${projectId}/${Date.now()}.${ext}`;

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from("project-media")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        console.error("Upload error:", uploadError);
        return { error: uploadError.message };
    }

    // Public URL 가져오기
    const { data: urlData } = supabaseAdmin
        .storage
        .from("project-media")
        .getPublicUrl(fileName);

    // media 테이블에 저장
    const { data, error } = await supabaseAdmin
        .from("media")
        .insert([{
            project_id: projectId,
            url: urlData.publicUrl,
            type: file.type.startsWith("image/") ? "image" :
                  file.type.startsWith("video/") ? "video" : "other",
        }])
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true, data };
}

export async function deleteMedia(mediaId: string, projectId: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // media 정보 가져오기
    const { data: media } = await supabaseAdmin
        .from("media")
        .select("url")
        .eq("id", mediaId)
        .single();

    if (media?.url) {
        // Storage에서 파일 삭제
        const path = media.url.split("/project-media/")[1];
        if (path) {
            await supabaseAdmin.storage.from("project-media").remove([path]);
        }
    }

    // DB에서 삭제
    const { error } = await supabaseAdmin
        .from("media")
        .delete()
        .eq("id", mediaId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
}

export async function updateProjectThumbnail(projectId: string, formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "파일이 없습니다." };
    }

    const ext = file.name.split(".").pop();
    const fileName = `thumbnails/${projectId}.${ext}`;

    // 기존 썸네일 삭제 (있으면)
    await supabaseAdmin.storage.from("project-media").remove([fileName]);

    // 새 썸네일 업로드
    const { error: uploadError } = await supabaseAdmin
        .storage
        .from("project-media")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) {
        return { error: uploadError.message };
    }

    const { data: urlData } = supabaseAdmin
        .storage
        .from("project-media")
        .getPublicUrl(fileName);

    // 프로젝트 thumbnail_url 업데이트
    const { error } = await supabaseAdmin
        .from("projects")
        .update({ thumbnail_url: urlData.publicUrl })
        .eq("id", projectId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/");
    return { success: true, url: urlData.publicUrl };
}
```

### 3.3 ImageUploader 컴포넌트

**파일:** `src/components/ui/image-uploader.tsx`

```typescript
"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { updateProjectThumbnail } from "@/lib/actions";

interface ImageUploaderProps {
    projectId: string;
    currentUrl?: string;
    onUploadComplete?: (url: string) => void;
}

export default function ImageUploader({
    projectId,
    currentUrl,
    onUploadComplete
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // 미리보기 설정
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // 업로드
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await updateProjectThumbnail(projectId, formData);

        if (result.error) {
            alert(`업로드 실패: ${result.error}`);
            setPreview(currentUrl || null);
        } else if (result.url) {
            onUploadComplete?.(result.url);
        }

        setUploading(false);
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">썸네일 이미지</label>
            <div
                onClick={() => inputRef.current?.click()}
                className="relative aspect-video rounded-xl border-2 border-dashed border-surface-3 hover:border-primary-500 transition-colors cursor-pointer overflow-hidden group"
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">클릭하여 변경</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">클릭하여 업로드</span>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
```

---

## 4. 프로젝트 순서 변경

### 4.1 updateProjectOrder Server Action

**파일:** `src/lib/actions.ts`에 추가

```typescript
export async function updateProjectOrder(projectIds: string[]) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // 각 프로젝트의 order_index 업데이트
    const updates = projectIds.map((id, index) =>
        supabaseAdmin
            .from("projects")
            .update({ order_index: index })
            .eq("id", id)
    );

    await Promise.all(updates);

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
}
```

### 4.2 드래그 앤 드롭 (선택사항)

필요한 패키지:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**파일:** `src/components/admin/sortable-project-list.tsx`

```typescript
"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { updateProjectOrder } from "@/lib/actions";

interface Project {
    id: string;
    title: string;
    // ... other fields
}

function SortableItem({ project }: { project: Project }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 bg-surface-1 rounded-xl border border-surface-3"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary"
            >
                <GripVertical className="h-5 w-5" />
            </button>
            <span className="font-medium">{project.title}</span>
        </div>
    );
}

export default function SortableProjectList({
    initialProjects
}: {
    initialProjects: Project[]
}) {
    const [projects, setProjects] = useState(initialProjects);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = projects.findIndex(p => p.id === active.id);
            const newIndex = projects.findIndex(p => p.id === over.id);

            const newProjects = arrayMove(projects, oldIndex, newIndex);
            setProjects(newProjects);

            // 서버에 순서 저장
            setSaving(true);
            await updateProjectOrder(newProjects.map(p => p.id));
            setSaving(false);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={projects.map(p => p.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {projects.map(project => (
                        <SortableItem key={project.id} project={project} />
                    ))}
                </div>
            </SortableContext>
            {saving && (
                <p className="text-sm text-text-muted mt-2">순서 저장 중...</p>
            )}
        </DndContext>
    );
}
```

---

## 5. Rich Text Editor

### 5.1 Tiptap 설치

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-youtube @tiptap/extension-placeholder
```

### 5.2 RichTextEditor 컴포넌트

**파일:** `src/components/editor/rich-text-editor.tsx`

```typescript
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold, Italic, List, ListOrdered,
    Image as ImageIcon, Link as LinkIcon,
    Youtube as YoutubeIcon, Heading1, Heading2
} from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "내용을 입력하세요..."
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Youtube.configure({
                controls: true,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt("이미지 URL을 입력하세요:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const url = window.prompt("링크 URL을 입력하세요:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addYoutube = () => {
        const url = window.prompt("YouTube URL을 입력하세요:");
        if (url) {
            editor.commands.setYoutubeVideo({ src: url });
        }
    };

    return (
        <div className="border border-surface-3 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-surface-2 border-b border-surface-3">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("bold") ? "bg-surface-3" : ""}`}
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("italic") ? "bg-surface-3" : ""}`}
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("heading", { level: 1 }) ? "bg-surface-3" : ""}`}
                >
                    <Heading1 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("heading", { level: 2 }) ? "bg-surface-3" : ""}`}
                >
                    <Heading2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("bulletList") ? "bg-surface-3" : ""}`}
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("orderedList") ? "bg-surface-3" : ""}`}
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-surface-3 mx-1 self-center" />
                <button onClick={addImage} className="p-2 rounded hover:bg-surface-3">
                    <ImageIcon className="h-4 w-4" />
                </button>
                <button onClick={addLink} className="p-2 rounded hover:bg-surface-3">
                    <LinkIcon className="h-4 w-4" />
                </button>
                <button onClick={addYoutube} className="p-2 rounded hover:bg-surface-3">
                    <YoutubeIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
            />
        </div>
    );
}
```

### 5.3 에디터 스타일

**파일:** `src/app/globals.css`에 추가

```css
/* Tiptap Editor Styles */
.ProseMirror {
    outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
    color: #6b7280;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

.ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
}

.ProseMirror iframe {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 0.5rem;
}
```

---

## 6. UI 컴포넌트 분리

### 6.1 Button 컴포넌트

**파일:** `src/components/ui/button.tsx`

```typescript
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", loading, children, className = "", disabled, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/25",
            secondary: "bg-surface-2 text-text-primary hover:bg-surface-3 border border-surface-3",
            ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-2",
            danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm gap-1.5",
            md: "px-4 py-2.5 text-sm gap-2",
            lg: "px-6 py-3 text-base gap-2",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
```

### 6.2 Input 컴포넌트

**파일:** `src/components/ui/input.tsx`

```typescript
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = "", ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full rounded-xl border bg-surface-1 px-4 py-3
                            outline-none transition-all
                            ${icon ? "pl-12" : ""}
                            ${error
                                ? "border-red-500 focus:border-red-500"
                                : "border-surface-3 focus:border-primary-500"
                            }
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
```

### 6.3 Card 컴포넌트

**파일:** `src/components/ui/card.tsx`

```typescript
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
    return (
        <div
            className={`
                rounded-2xl bg-surface-1 border border-surface-3 p-6
                ${hover ? "hover:border-primary-500/30 hover:bg-surface-2 transition-all cursor-pointer" : ""}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <p className={`text-text-secondary text-sm ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`mt-4 pt-4 border-t border-surface-3 ${className}`}>{children}</div>;
}
```

### 6.4 Modal 컴포넌트

**파일:** `src/components/ui/modal.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md"
}: ModalProps) {
    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizes[size]} bg-surface-1 border border-surface-3 rounded-2xl shadow-2xl z-50 overflow-hidden`}
                    >
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-3">
                                <h2 className="text-lg font-bold text-white">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-text-muted" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
```

### 6.5 컴포넌트 인덱스 파일

**파일:** `src/components/ui/index.ts`

```typescript
export { default as Button } from "./button";
export { default as Input } from "./input";
export { default as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
export { default as Modal } from "./modal";
export { default as InfiniteScrollTrigger } from "./infinite-scroll-trigger";
export { default as ImageUploader } from "./image-uploader";
```

---

## 7. 커스텀 훅

### 7.1 useAuth 훅

**파일:** `src/hooks/use-auth.ts`

```typescript
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { ADMIN_WHITELIST } from "@/lib/constants";

export function useAuth() {
    const { data: session, status } = useSession();

    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const user = session?.user;

    const isAdmin = user?.email
        ? ADMIN_WHITELIST.some(admin =>
            user.email?.includes(admin) || user.name === admin
          )
        : false;

    const login = () => signIn("github");
    const logout = () => signOut();

    return {
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
    };
}
```

### 7.2 useProjects 훅

**파일:** `src/hooks/use-projects.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("order_index", { ascending: true })
            .order("created_at", { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setProjects(data || []);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        loading,
        error,
        refetch: fetchProjects,
    };
}

export function useProject(id: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);

            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setProject(data);
            }

            setLoading(false);
        }

        if (id) {
            fetchProject();
        }
    }, [id]);

    return { project, loading, error };
}
```

### 7.3 훅 인덱스 파일

**파일:** `src/hooks/index.ts`

```typescript
export { useAuth } from "./use-auth";
export { useProjects, useProject } from "./use-projects";
export { useInfiniteProjects } from "./use-infinite-projects";
```

---

## 8. 타입 정리

### 8.1 Project 타입

**파일:** `src/types/project.ts`

```typescript
import type { Database } from "@/lib/supabase/types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type Media = Database["public"]["Tables"]["media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];

export interface ProjectWithMedia extends Project {
    media?: Media[];
}
```

### 8.2 API 응답 타입

**파일:** `src/types/api.ts`

```typescript
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        hasMore: boolean;
    };
}
```

### 8.3 타입 인덱스 파일

**파일:** `src/types/index.ts`

```typescript
export * from "./project";
export * from "./api";
```

---

## 9. SEO 메타태그

### 9.1 루트 레이아웃 메타데이터

**파일:** `src/app/layout.tsx` 수정

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Tucode Pamoja | Code Together, Vibe Forever",
        template: "%s | Tucode Pamoja",
    },
    description: "'함께'라는 가치 아래 모여 코드로 소통하고 성장의 온기를 나누는 팀, 우리의 모든 발자취를 이곳에 기록합니다.",
    keywords: ["portfolio", "developer", "team", "projects", "github"],
    authors: [{ name: "Tucode Pamoja" }],
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "https://tucode-pamoja.vercel.app",
        siteName: "Tucode Pamoja",
        title: "Tucode Pamoja | Code Together, Vibe Forever",
        description: "'함께'라는 가치 아래 모여 코드로 소통하고 성장의 온기를 나누는 팀",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Tucode Pamoja",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Tucode Pamoja",
        description: "Code Together, Vibe Forever",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
};
```

### 9.2 프로젝트 상세 페이지 동적 메타데이터

**파일:** `src/app/(main)/projects/[id]/page.tsx` 수정

```typescript
import type { Metadata } from "next";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data: project } = await supabase
        .from("projects")
        .select("title, description, thumbnail_url")
        .eq("id", params.id)
        .single();

    if (!project) {
        return {
            title: "프로젝트를 찾을 수 없습니다",
        };
    }

    return {
        title: project.title,
        description: project.description || `${project.title} - Tucode Pamoja 프로젝트`,
        openGraph: {
            title: project.title,
            description: project.description || undefined,
            images: project.thumbnail_url ? [project.thumbnail_url] : undefined,
        },
    };
}
```

---

## 10. Vercel 배포

### 10.1 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수 설정:

```
# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_ACCESS_TOKEN=your-github-access-token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 10.2 vercel.json (선택)

**파일:** `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 10.3 배포 체크리스트

- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정
- [ ] GitHub OAuth 앱의 callback URL 업데이트
  - `https://your-domain.vercel.app/api/auth/callback/github`
- [ ] Supabase에서 Site URL 업데이트
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 배포 후 기능 테스트

---

## 파일 생성 요약

```
src/
├── app/
│   └── admin/projects/[id]/
│       └── page.tsx                    # 프로젝트 편집 페이지
├── components/
│   ├── ui/
│   │   ├── index.ts                    # UI 컴포넌트 인덱스
│   │   ├── button.tsx                  # 버튼 컴포넌트
│   │   ├── input.tsx                   # 인풋 컴포넌트
│   │   ├── card.tsx                    # 카드 컴포넌트
│   │   ├── modal.tsx                   # 모달 컴포넌트
│   │   ├── image-uploader.tsx          # 이미지 업로더
│   │   └── infinite-scroll-trigger.tsx # 무한 스크롤 트리거
│   ├── editor/
│   │   └── rich-text-editor.tsx        # Tiptap 에디터
│   └── admin/
│       └── sortable-project-list.tsx   # 드래그 정렬 리스트
├── hooks/
│   ├── index.ts                        # 훅 인덱스
│   ├── use-auth.ts                     # 인증 훅
│   ├── use-projects.ts                 # 프로젝트 훅
│   └── use-infinite-projects.ts        # 무한 스크롤 훅
├── types/
│   ├── index.ts                        # 타입 인덱스
│   ├── project.ts                      # 프로젝트 타입
│   └── api.ts                          # API 응답 타입
└── lib/
    └── actions.ts                      # + updateProject, uploadMedia 등

루트/
└── vercel.json                         # Vercel 설정 (선택)
```

---

## 설치 필요 패키지

```bash
# Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-youtube @tiptap/extension-placeholder

# Drag and Drop (선택)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```
