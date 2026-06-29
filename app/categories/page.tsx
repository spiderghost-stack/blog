import { categories } from "@/src/constants";

export default function CategoriesPage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-12 sm:px-6 lg:px-8">
            <section className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Catégories</p>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                    Parcourez les thèmes de MindLog
                </h1>
                <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                    Des sujets variés pour apprendre, créer et organiser vos idées avec clarté.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                    <div key={category} className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">{category}</h3>
                        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                            Découvrez les meilleurs articles autour de {category.toLowerCase()} et des bonnes pratiques associées.
                        </p>
                    </div>
                ))}
            </section>
        </main>
    );
}
