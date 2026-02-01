import { supabaseAdmin } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import SortableProjectList from "@/components/admin/sortable-project-list";

export default async function AdminProjectsPage() {
    const { data: projects } = await supabaseAdmin
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

    return (
        <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">프로젝트 관리</h1>
                    <p className="text-text-secondary mt-2">등록된 모든 라이브 프로젝트를 관리합니다.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    새 프로젝트 추가
                </Link>
            </div>

            <div className="grid gap-4">
                {projects?.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-text-secondary">아직 등록된 프로젝트가 없습니다.</p>
                    </div>
                ) : (
                    <SortableProjectList projects={projects || []} />
                )}
            </div>
        </div>
    );
}
