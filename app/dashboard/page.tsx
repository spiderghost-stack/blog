"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, FileText, MessageCircle, Sparkles, UserRound, Settings, PlusCircle, PencilLine, Trash2 } from "lucide-react";
import { getPostsByAuthor } from "@/src/lib/firebase/firestore";
import { useAuth } from "@/src/contexts/auth-context";
import type { Post } from "@/src/types";

export default function DashboardPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getPostsByAuthor(user.uid).then((data) => {
                setPosts(data as any);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [user]);

    const stats = [
        { label: "Articles", value: posts.length, icon: FileText },
        { label: "Vues", value: posts.reduce((acc, post) => acc + (post.views || 0), 0), icon: BarChart3 },
        { label: "Likes", value: posts.reduce((acc, post) => acc + (post.likes || 0), 0), icon: Sparkles },
        { label: "Commentaires", value: posts.reduce((acc, post) => acc + (post.commentsCount || 0), 0), icon: MessageCircle },
    ];
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-12 sm:px-6 lg:px-8">
            <section className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Dashboard</p>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                    Gérez votre espace auteur
                </h1>
                <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                    Suivez vos performances, publiez vos idées et administrez votre contenu depuis un seul endroit.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                                <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-zinc-950 dark:text-white">{stat.value}</p>
                        </div>
                    );
                })}
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">Mes articles</h2>
                        <Link href="/dashboard/new" className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                            <PlusCircle className="h-4 w-4" />
                            Nouvel article
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-zinc-500 text-sm">Chargement de vos articles...</p>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-white">{post.title}</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{post.status} · {post.category}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" className="rounded-full border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"><PencilLine className="h-4 w-4" /></button>
                                        <button type="button" className="rounded-full border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm">Vous n'avez pas encore d'articles.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">Profil</h2>
                        <button type="button" className="rounded-full border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"><Settings className="h-4 w-4" /></button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                <UserRound className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-zinc-950 dark:text-white">{user?.displayName || "Auteur Inconnu"}</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Auteur</p>
                            </div>
                        </div>
                        <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                            Product designer, auteure de contenu et créatrice de systèmes de pensée pour transformer l’information en expérience.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
