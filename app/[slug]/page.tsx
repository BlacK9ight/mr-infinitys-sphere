import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FeedbackWidget from "@/components/FeedbackWidget";
import { excerpt, formatDate, readingTime } from "@/lib/text";
import { fontFamilyFor } from "@/lib/fonts";
import { glass, glassHover } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// cache() lets the page and its metadata share one database lookup.
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
  const post = await getPost(slug);
  if (!post) notFound();

  // Titles and dates only, so images inside other posts are not loaded here.
  const more = await prisma.post.findMany({
    where: { published: true, NOT: { slug } },
    orderBy: { createdAt: "desc" },
    take: 2,
    select: { id: true, slug: true, title: true, font: true, category: true, createdAt: true },
  });

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

        <article style={{ fontFamily: fontFamilyFor(post.font) }} className="mt-10">
          {post.category && (
            <span className="text-sm font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400">
              {post.category}
            </span>
          )}
          <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">{post.title}</h1>
          <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
            {formatDate(post.createdAt)} • {readingTime(post.content)} min read
          </p>

          {/* Post HTML comes from the admin editor only (see lib/admin.ts). */}
          <div
            className="mt-10 prose prose-lg prose-stone dark:prose-invert max-w-none prose-a:text-orange-800 dark:prose-a:text-orange-400 prose-blockquote:border-orange-700 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

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
