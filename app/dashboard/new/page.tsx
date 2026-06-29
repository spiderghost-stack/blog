"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/auth-context";
import { createPost } from "@/src/lib/firebase/firestore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Link as LinkIcon, Loader2, UserCircle2 } from "lucide-react";
import Image from "next/image";

export default function NewPostPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Design");
    const [coverImage, setCoverImage] = useState(""); // Gère désormais directement l'URL
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Que voulez-vous partager, " + (user?.displayName?.split(" ")[0] || "aujourd'hui") + " ?",
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[150px] max-w-none resize-none",
            },
        },
    });

    const handlePublish = async () => {
        if (!user) {
            setError("Vous devez être connecté pour publier.");
            return;
        }
        if (!title.trim() || !editor?.getText().trim()) {
            setError("Le titre et le contenu sont obligatoires.");
            return;
        }

        setIsPublishing(true);
        setError(null);

        try {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            await createPost({
                title,
                slug,
                content: editor.getHTML(),
                summary: editor.getText().slice(0, 150) + "...",
                excerpt: editor.getText().slice(0, 150) + "...",
                coverImage: coverImage.trim(), // Envoi direct du lien URL texte à Firestore
                category,
                tags: "",
                authorId: user.uid,
                authorName: user.displayName || "Auteur Inconnu",
                authorAvatar: user.photoURL || "",
                views: 0,
                likes: 0,
                commentsCount: 0,
                readTime: Math.ceil((editor.getText().length || 0) / 1000),
                readingTime: Math.ceil((editor.getText().length || 0) / 1000),
                status: "published",
                featured: false,
                published: true,
                local: editor.getHTML(),
                ceateAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Erreur de publication", err);
            setError(err.message || "Une erreur est survenue lors de la publication.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-start px-4 py-8 sm:px-6 sm:py-12">
            <div className="w-full rounded-2xl border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
                    <h1 className="text-xl font-bold text-zinc-950 dark:text-white text-center w-full">Créer une publication</h1>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 space-y-6">
                    {error ? (
                        <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            {error}
                        </div>
                    ) : null}

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        {user?.photoURL ? (
                            <Image src={user.photoURL} alt="Avatar" width={44} height={44} className="rounded-full object-cover" />
                        ) : (
                            <UserCircle2 className="h-11 w-11 text-zinc-400" />
                        )}
                        <div>
                            <p className="font-semibold text-zinc-950 dark:text-white">{user?.displayName || "Auteur"}</p>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-0.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                                <option value="Technologie">Technologie</option>
                                <option value="Personnel">Personnel</option>
                                <option value="Développement">Développement</option>
                                <option value="Productivité">Productivité</option>
                                <option value="Design">Design</option>
                                <option value="Science">Science</option>
                                <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                            </select>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Titre de la publication..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-none bg-transparent px-0 py-2 text-2xl font-bold text-zinc-950 placeholder:text-zinc-400 outline-none dark:text-white dark:placeholder:text-zinc-500"
                        />
                    </div>
                    
                    {/* Conteneur de l'éditeur de texte (Rendu plus visible et contrasté) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Contenu de l'article 
                        </label>
                        <div className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 p-4 text-zinc-900 focus-within:border-indigo-500 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-white dark:focus-within:border-indigo-500 dark:focus-within:bg-zinc-900 transition-all shadow-inner">
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {/* Bloc URL Cover Image (Remplace l'ancienne section d'upload) */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            <LinkIcon className="h-4 w-4 text-indigo-500" />
                            <span>Image de couverture (URL)</span>
                        </div>
                        <input 
                            type="url"
                            placeholder="Collez le lien de votre image "
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 transition-colors"
                        />

                        {/* Aperçu Dynamique Live de l'URL */}
                        {coverImage.trim() && (
                            <div className="relative mt-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <div className="bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                    Aperçu en direct :
                                </div>
                                <img 
                                    src={coverImage} 
                                    alt="Aperçu couverture" 
                                    className="max-h-[200px] w-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="w-full rounded-xl bg-indigo-600 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {isPublishing ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Publication en cours...
                            </span>
                        ) : (
                            "Publier"
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}