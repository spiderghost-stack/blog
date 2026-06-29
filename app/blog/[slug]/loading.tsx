import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center items-center gap-4 px-5 py-24 sm:px-6 lg:px-8">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-zinc-500 text-lg font-medium">Chargement de l'article...</p>
        </main>
    );
}
