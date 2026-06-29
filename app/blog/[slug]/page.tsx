import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockComments, mockPosts } from "@/src/lib/data/mock"; // Vérifie bien que mockPosts est exporté dans ce fichier
import { getPostBySlug } from "@/src/lib/firebase/firestore";
// attention la ligne là est dans bloc note je test le baill de l'url
import { ArticleActions } from "@/components/blog/article-actions";
// mindlog/app/blog/[slug]/page.tsx

// Modifie ta ligne d'import de utils pour y ajouter cleanImageUrl
import { formatDate, cleanImageUrl } from "@/src/lib/utils";

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    
    // 1. On récupère l'article depuis Firestore
    let dbPost = await getPostBySlug(slug);
    let post: any = dbPost;

    // 2. Si non trouvé dans la base de données, on cherche dans le mock
    if (!post) {
        const mockPost = mockPosts.find((p: any) => p.slug === slug);
        if (mockPost) {
            post = mockPost;
        }
    }

    // 3. Si TOUJOURS introuvable (ni en BDD ni en Mock), on déclenche le 404 immédiatement
    if (!post) {
        notFound();
    }

    // Désormais, TypeScript sait à 100% que 'post' n'est plus ni 'null' ni 'undefined' ici.

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 py-12 sm:px-6 lg:px-8">
            <Link href="/blog" className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-indigo-600 dark:text-zinc-400">
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
            </Link>

            <article className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="h-80 w-full object-cover" />
                ) : null}
                <div className="space-y-8 p-6 sm:p-10">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{post.category}</span>
                            <span>{formatDate(post.createdAt || post.ceateAt)}</span>
                            <span>{post.readTime || post.readingTime || 0} min de lecture</span>
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                            {post.title}
                        </h1>
                        <p className="max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 py-4 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            {post.authorAvatar ? (
                                <img src={post.authorAvatar} alt={post.authorName} className="h-12 w-12 rounded-full object-cover" />
                            ) : null}
                            <div>
                                <p className="font-semibold text-zinc-950 dark:text-white">{post.authorName}</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Auteur · {post.category}</p>
                            </div>
                        </div>
                        <ArticleActions initialViews={post.views} initialLikes={post.likes} commentCount={mockComments.length} />
                    </div>

                    <div className="prose max-w-none prose-zinc dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: post.local || post.content || post.summary || "" }} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {post.tags ? (
                            Array.isArray(post.tags) ? (
                                post.tags.map((tag: string) => (
                                    <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">#{tag}</span>
                                ))
                            ) : (
                                post.tags.split(',').filter(Boolean).map((tag: string) => (
                                    <span key={tag.trim()} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">#{tag.trim()}</span>
                                ))
                            )
                        ) : null}
                    </div>
                </div>
            </article>

            <section id="comments" className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">Commentaires</h2>
                <div className="mt-6 space-y-4">
                    {mockComments.map((comment) => (
                        <div key={comment.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="mb-2 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                                <span className="font-semibold text-zinc-950 dark:text-white">{comment.userName}</span>
                                <span>{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="leading-7 text-zinc-600 dark:text-zinc-400">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}