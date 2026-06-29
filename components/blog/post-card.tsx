"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, Eye } from "lucide-react";
import type { Post } from "@/src/types";
import { formatDate } from "@/src/lib/utils";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const [stats, setStats] = useState({ views: post.views, likes: post.likes, comments: post.commentsCount || 3 });
    const [liked, setLiked] = useState(false);

    const handleView = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setStats((current) => ({ ...current, views: current.views + 1 }));
    };

    const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setLiked((value) => !value);
        setStats((current) => ({ ...current, likes: current.likes + (liked ? -1 : 1) }));
    };

    return (
        <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <Link href={`/blog/${post.slug}`} className="block">
                {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="h-48 w-full object-cover" />
                ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <span className="text-sm text-zinc-400 dark:text-zinc-500">Pas d'image</span>
                    </div>
                )}
            </Link>
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{post.category}</span>
                    <span>{formatDate(post.ceateAt || post.createdAt)}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="block">
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-950 transition group-hover:text-indigo-600 dark:text-white">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">{post.summary || post.excerpt}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button type="button" onClick={handleView} className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1.5 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white">
                            <Eye className="h-4 w-4" />{stats.views}
                        </button>
                        <button type="button" onClick={handleLike} className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 transition ${liked ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300" : "border-zinc-200 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white"}`}>
                            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />{stats.likes}
                        </button>
                        <Link href={`/blog/${post.slug}#comments`} className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1.5 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white">
                            <MessageCircle className="h-4 w-4" />{stats.comments}
                        </Link>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 font-medium text-indigo-600">
                        Lire <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
