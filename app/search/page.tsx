"use client";

import { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { getPosts } from "@/src/lib/firebase/firestore";
import type { Post } from "@/src/types";

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPosts().then((data) => {
            setPosts(data as any);
            setLoading(false);
        });
    }, []);

    const filteredPosts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return posts;
        return posts.filter((post) => {
            const haystack = [post.title, post.summary, post.excerpt, post.category, ...(Array.isArray(post.tags) ? post.tags : (post.tags ? (post.tags as string).split(",") : []))].join(" ").toLowerCase();
            return haystack.includes(query);
        });
    }, [searchTerm, posts]);

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-12 sm:px-6 lg:px-8">
            <section className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Recherche</p>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                    Trouvez rapidement ce que vous cherchez
                </h1>
                <label className="flex items-center gap-3 rounded-3xl border border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <SearchIcon className="h-5 w-5" />
                    <input 
                        className="w-full bg-transparent outline-none" 
                        placeholder="Rechercher par titre, contenu, catégorie ou tag" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
            </section>

            {loading ? (
                <div className="flex justify-center p-10"><p className="text-zinc-500">Chargement...</p></div>
            ) : filteredPosts.length > 0 ? (
                <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </section>
            ) : (
                <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                    Aucun article trouvé.
                </div>
            )}
        </main>
    );
}
