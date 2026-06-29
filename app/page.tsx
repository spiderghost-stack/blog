import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, TrendingUp, Search, ShieldCheck } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredStats, categories } from "@/src/constants";
import { getPosts } from "@/src/lib/firebase/firestore";
import { HeroSlider } from "@/components/ui/hero-slider";

export const dynamic = 'force-dynamic';
export default async function Home() {
  const posts = await getPosts();
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_45%)] px-5 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl h-[50vh] min-h-[400px] lg:h-[65vh] mb-12">
            <HeroSlider />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] pb-20 lg:pb-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Nouveau blog personnel pensé pour créer, apprendre et partager
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
                Écrivez, publiez et partagez votre pensée avec élégance.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                MindLog est une plateforme de blog moderne, responsive et pensée pour les créateurs qui veulent produire du contenu premium avec une expérience fluide.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/blog" className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700">
                Explorer le blog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard/new" className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-3 font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white">
                Créer un article
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {featuredStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                  <p className="text-2xl font-semibold text-zinc-950 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Aujourd’hui</p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">Ce que vous pouvez faire</h2>
              </div>
              <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {[
                { icon: Search, title: "Recherche instantanée", text: "Trouvez un contenu grâce à une recherche riche et fluide." },
                { icon: TrendingUp, title: "Statistiques en temps réel", text: "Suivez vues, likes et commentaires dans votre dashboard." },
                { icon: ShieldCheck, title: "Sécurité et qualité", text: "Bénéficiez d’une architecture moderne prête pour la production." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-950 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Articles récents" title="Les sujets à ne pas manquer" description="Des lectures courtes, utiles et structurées pour apprendre chaque semaine." />
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Catégories" title="Explorer par thème" description="Choisissez un sujet selon votre besoin du moment." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg font-semibold text-zinc-950 dark:text-white">{category}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Contenu sélectionné autour de {category.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Newsletter</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">Recevez les meilleurs articles chaque semaine</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input placeholder="Votre email" className="rounded-full border border-zinc-300 bg-white px-4 py-3 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
            <Link href="/auth?mode=signup" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700">
              S’inscrire
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
