import { supabaseAdmin } from "@/lib/supabase/server";
import { Plus, Github, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { deleteTeamMember } from "@/lib/actions";

export default async function AdminTeamPage() {
    const { data: members, error } = await supabaseAdmin
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

    if (error && error.code !== 'PGRST116') { // Ignore if table doesn't exist yet but log it
        console.error("Error fetching team members:", error);
    }

    return (
        <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">팀원 관리</h1>
                    <p className="text-text-secondary">함께하는 멤버들의 프로필을 관리합니다.</p>
                </div>
                <Link
                    href="/admin/team/new"
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full text-sm"
                >
                    <Plus className="h-4 w-4" />
                    새 멤버 등록
                </Link>
            </div>

            <div className="grid gap-4">
                {(!members || members.length === 0) ? (
                    <div className="card text-center py-12 border-dashed border-2 border-surface-3 bg-transparent">
                        <p className="text-text-secondary">아직 등록된 멤버가 없습니다.</p>
                        <p className="text-sm text-text-muted mt-2">새 멤버 등록 버튼을 눌러 팀원을 추가해보세요.</p>
                    </div>
                ) : (
                    members.map((member) => (
                        <div key={member.id} className="card flex items-center justify-between group p-6">
                            <div className="flex items-center gap-4">
                                {member.thumbnail_url ? (
                                    <img src={member.thumbnail_url} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-surface-3" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-text-muted text-xs">
                                        No IMG
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        {member.name}
                                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-surface-2 text-text-secondary">
                                            {member.role || "Member"}
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                                        {member.github_url && (
                                            <a href={member.github_url} target="_blank" className="hover:text-primary-500 flex items-center gap-1">
                                                <Github className="h-3 w-3" />
                                                GitHub
                                            </a>
                                        )}
                                        {member.tags && member.tags.length > 0 && (
                                            <span className="text-text-muted">| {member.tags.slice(0, 3).join(", ")}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/team/${member.id}`}
                                    className="p-2 hover:bg-surface-3 rounded-lg transition-colors text-text-secondary hover:text-primary-400"
                                >
                                    <Pencil className="h-5 w-5" />
                                </Link>
                                <form action={async () => {
                                    "use server";
                                    await deleteTeamMember(member.id);
                                }}>
                                    <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-text-secondary">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
