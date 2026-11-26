import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FeedbackWidget from "@/components/FeedbackWidget";
import PostArticle from "@/components/PostArticle";
import { excerpt, formatDate } from "@/lib/text";
import { fontFamilyFor } from "@/lib/fonts";
import { glass, glassHover } from "@/lib/ui";

// Served from cache for speed; the admin actions rebuild it when a post changes.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// cache() lets the page and its metadata share one database lookup.
// Drafts are never shown here.
const getPost = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  return post && post.published ? post : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found | Mr. Infinity's Sphere" };
  return {
    title: `${post.title} | Mr. Infinity's Sphere`,
    description: excerpt(post.content),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  // Both lookups start together instead of one after the other.
  // "More" is titles and dates only, so images inside other posts are not loaded.
  const [post, more] = await Promise.all([
    getPost(slug),
    prisma.post.findMany({
      where: { published: true, NOT: { slug } },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, slug: true, title: true, font: true, category: true, createdAt: true },
    }),
  ]);
  if (!post) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="inline-block text-sm font-bold text-stone-600 hover:text-stone-900 hover:-translate-x-1 transition-transform dark:text-stone-400 dark:hover:text-white"
        >
          ← Back to Orbit
        </Link>

        <div className="mt-10">
          <PostArticle post={post} />
        </div>

        {more.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-4">Keep reading</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {more.map((p) => (
                <Link key={p.id} href={`/${p.slug}`} className="block">
                  <article className={`group h-full p-6 rounded-3xl ${glass} ${glassHover}`}>
                    {p.category && (
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400">
                        {p.category}
                      </span>
                    )}
                    <h3
                      style={{ fontFamily: fontFamilyFor(p.font) }}
                      className="mt-1 text-xl font-bold transition-colors group-hover:text-orange-700 dark:group-hover:text-orange-400"
                    >
                      {p.title}
                    </h3>
                    <span className="mt-3 block text-sm text-stone-600 dark:text-stone-400">{formatDate(p.createdAt)}</span>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <FeedbackWidget />
    </div>
  );
}
