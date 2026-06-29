import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center gap-6 px-5 py-24 sm:px-6 lg:px-8">
            <div className="rounded-full bg-indigo-50 p-4 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Search className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-5xl text-center">
                Page introuvable
            </h1>
            <p className="max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
                Désolé, nous n'avons pas pu trouver la page que vous recherchez. L'article a peut-être été déplacé ou supprimé.
            </p>
            <div className="mt-4 flex gap-4">
                <Link href="/" className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700">
                    Retour à l'accueil
                </Link>
                <Link href="/blog" className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-300 dark:border-zinc-800 dark:text-white dark:hover:border-zinc-700">
                    Explorer le blog
                </Link>
            </div>
        </main>
    );
}
