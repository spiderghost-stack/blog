"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { categories } from "@/src/constants";
import { getPosts } from "@/src/lib/firebase/firestore";
import type { Post } from "@/src/types";

const pageSize = 6;

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
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
        return posts.filter((post) => {
            const tagsArray = Array.isArray(post.tags) ? post.tags : (post.tags ? (post.tags as string).split(",") : []);
            const haystack = [post.title, post.summary, post.excerpt, post.category, ...tagsArray].join(" ").toLowerCase();
            const matchesSearch = !query || haystack.includes(query);
            const matchesCategory = activeCategory === "Tous" || post.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory, posts]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, activeCategory]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
    const paginatedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-12 sm:px-6 lg:px-8">
            <section className="space-y-6">
                <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Blog</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                        Explorer l’univers MindLog
                    </h1>
                    <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Retrouvez les derniers articles, filtres par catégorie et les sujets les plus utiles à votre quotidien.
                    </p>
                </div>

                <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
                    <label className="flex flex-1 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                        <Search className="h-4 w-4" />
                        <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher un article..." className="w-full bg-transparent outline-none" />
                    </label>
                    <button type="button" onClick={() => setShowFilters((value) => !value)} className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white">
                        {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                        Filtrer
                    </button>
                </div>

                {showFilters ? (
                    <div className="flex flex-wrap gap-2 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <button type="button" onClick={() => setActiveCategory("Tous")} className={`rounded-full px-3 py-2 text-sm ${activeCategory === "Tous" ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                            Tous
                        </button>
                        {categories.map((category) => (
                            <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded-full px-3 py-2 text-sm ${activeCategory === category ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                ) : null}
            </section>

            {loading ? (
                <div className="flex h-40 w-full items-center justify-center">
                    <p className="text-zinc-500">Chargement des articles...</p>
                </div>
            ) : paginatedPosts.length > 0 ? (
                <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedPosts.map((post) => (
                        <PostCard key={post.id} post={post as any} />
                    ))}
                </section>
            ) : (
                <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                    Aucun article ne correspond à votre recherche.
                </div>
            )}

            <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <span>Page {page} sur {totalPages}</span>
                <div className="flex gap-3">
                    <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-full border border-zinc-200 px-4 py-2 font-medium text-zinc-950 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-white">
                        Précédent
                    </button>
                    <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-full border border-zinc-200 px-4 py-2 font-medium text-indigo-600 transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800">
                        Suivant
                    </button>
                </div>
            </div>
        </main>
    );
}
