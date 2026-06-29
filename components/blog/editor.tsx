"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Quote, Code, Link2, Image as ImageIcon, List, ListChecks } from "lucide-react";

interface EditorProps {
    content: string;
    onChange: (value: string) => void;
}

export function BlogEditor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image.configure({ inline: true }),
            Placeholder.configure({ placeholder: "Rédigez votre article ici…" }),
        ],
        content,
        editorProps: {
            attributes: {
                class: "min-h-[320px] rounded-2xl border border-zinc-200 bg-zinc-50 p-4 outline-none dark:border-zinc-700 dark:bg-zinc-950",
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    if (!editor) return null;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Bold className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Italic className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><UnderlineIcon className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Heading1 className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Heading2 className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Quote className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Code className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><List className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ListChecks className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().extendMarkRange("link").setLink({ href: "https://example.com" }).run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Link2 className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().setImage({ src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80" }).run()} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ImageIcon className="h-4 w-4" /></button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
