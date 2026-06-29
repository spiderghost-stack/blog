"use client";

import { useState } from "react";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";

interface ArticleActionsProps {
    initialViews: number;
    initialLikes: number;
    commentCount: number;
}

export function ArticleActions({ initialViews, initialLikes, commentCount }: ArticleActionsProps) {
    const [views, setViews] = useState(initialViews);
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);

    const handleView = () => setViews((value) => value + 1);
    const handleLike = () => {
        setLiked((value) => !value);
        setLikes((value) => value + (liked ? -1 : 1));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 sm:gap-3 dark:text-zinc-400">
            <button type="button" onClick={handleView} className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1.5 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white">
                <Eye className="h-4 w-4" />{views}
            </button>
            <button type="button" onClick={handleLike} className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 transition ${liked ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300" : "border-zinc-200 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white"}`}>
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />{likes}
            </button>
            <a href="#comments" className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1.5 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white">
                <MessageCircle className="h-4 w-4" />{commentCount}
            </a>
            <button type="button" className="rounded-full border border-zinc-200 p-2 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-white">
                <Share2 className="h-4 w-4" />
            </button>
        </div>
    );
}
