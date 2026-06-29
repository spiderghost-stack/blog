import Link from "next/link";
import { BadgeCheck, Link2, Send } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="border-t border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <p className="text-xl font-semibold text-zinc-950 dark:text-white">MindLog</p>
                    <p className="mt-2 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                        Un espace de publication moderne, personnel et pensé pour les créateurs de contenu.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <Link href="/blog" className="transition hover:text-zinc-950 dark:hover:text-white">Blog</Link>
                    <Link href="/categories" className="transition hover:text-zinc-950 dark:hover:text-white">Catégories</Link>
                    <Link href="/dashboard" className="transition hover:text-zinc-950 dark:hover:text-white">Dashboard</Link>
                </div>
                <div className="flex gap-3">
                    {[Send, BadgeCheck, Link2].map((Icon, index) => (
                        <button key={index} type="button" className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white">
                            <Icon className="h-4 w-4" />
                        </button>
                    ))}
                </div>
            </div>
        </footer>
    );
}
