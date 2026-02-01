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
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, ExternalLink, Trash2, Github, Plus } from "lucide-react";
import { updateProjectOrder, deleteProject } from "@/lib/actions";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    description: string | null;
    github_url: string | null;
    tags: string[] | null;
    order_index: number;
}

interface SortableProjectListProps {
    projects: Project[];
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

    // Client-side delete handler wrapper
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("정말 삭제하시겠습니까?")) return;
        await deleteProject(project.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="card flex items-center justify-between group flex-col md:flex-row gap-4 p-4 md:items-center items-start"
        >
            <div className="flex items-start md:items-center gap-4 flex-1 w-full overflow-hidden">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-2 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary transition-colors touch-none shrink-0"
                    title="순서 변경"
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3 className="text-xl font-bold group-hover:text-primary-400 transition-colors truncate">
                        {project.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                        {project.github_url && (
                            <Link
                                href={project.github_url}
                                target="_blank"
                                className="flex items-center gap-1 shrink-0 hover:text-primary-400 transition-colors"
                            >
                                <Github className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">
                                    {new URL(project.github_url).pathname.slice(1)}
                                </span>
                            </Link>
                        )}
                        {project.tags && project.tags.length > 0 && (
                            <span className="flex items-center gap-1 shrink-0">
                                <Plus className="h-3 w-3 rotate-45" />
                                <span className="truncate max-w-[300px]">
                                    {project.tags.join(", ")}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:pl-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 hover:bg-surface-3 rounded-lg transition-colors group/btn"
                    title="편집"
                >
                    <Edit className="h-5 w-5 text-text-secondary group-hover/btn:text-primary-400" />
                </Link>
                <Link
                    href={`/projects/${project.id}`}
                    className="p-2 hover:bg-surface-3 rounded-lg transition-colors group/btn"
                    target="_blank"
                    title="미리보기"
                >
                    <ExternalLink className="h-5 w-5 text-text-secondary group-hover/btn:text-blue-400" />
                </Link>
                <form onSubmit={handleDelete}>
                    <button
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-text-secondary"
                        title="삭제"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function SortableProjectList({ projects: initialProjects }: SortableProjectListProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
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
            setProjects((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order on server
                handleUpdateOrder(newItems);

                return newItems;
            });
        }
    }

    async function handleUpdateOrder(items: Project[]) {
        setSaving(true);
        try {
            await updateProjectOrder(items.map(p => p.id));
        } catch (error) {
            console.error("Failed to update order:", error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-4">
                <SortableContext
                    items={projects.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {projects.map((project) => (
                        <SortableItem key={project.id} project={project} />
                    ))}
                </SortableContext>

                {saving && (
                    <p className="text-sm text-center text-text-muted animate-pulse">
                        순서 저장 중...
                    </p>
                )}
            </div>
        </DndContext>
    );
}
