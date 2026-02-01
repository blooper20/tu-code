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
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px]',
            },
        },
        immediatelyRender: false,
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
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("bold") ? "bg-surface-3" : ""}`}
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("italic") ? "bg-surface-3" : ""}`}
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("heading", { level: 1 }) ? "bg-surface-3" : ""}`}
                >
                    <Heading1 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("heading", { level: 2 }) ? "bg-surface-3" : ""}`}
                >
                    <Heading2 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("bulletList") ? "bg-surface-3" : ""}`}
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-surface-3 ${editor.isActive("orderedList") ? "bg-surface-3" : ""}`}
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-surface-3 mx-1 self-center" />
                <button type="button" onClick={addImage} className="p-2 rounded hover:bg-surface-3">
                    <ImageIcon className="h-4 w-4" />
                </button>
                <button type="button" onClick={addLink} className="p-2 rounded hover:bg-surface-3">
                    <LinkIcon className="h-4 w-4" />
                </button>
                <button type="button" onClick={addYoutube} className="p-2 rounded hover:bg-surface-3">
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
