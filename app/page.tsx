import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SubscribeForm from "@/components/SubscribeForm";
import FeedbackWidget from "@/components/FeedbackWidget";
import { excerpt, formatDate, readingTime } from "@/lib/text";
import { fontFamilyFor } from "@/lib/fonts";
import { glass, glassHover } from "@/lib/ui";

// Always read fresh posts, so a new post shows up right after publishing.
export const dynamic = "force-dynamic";

// Rings and a slow orbiting dot, echoing the logo.
function Orbit() {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden md:block h-56 w-56">
      <div className="absolute inset-0 rounded-full border border-orange-800/30 dark:border-orange-400/30" />
      <div className="absolute inset-7 rounded-full border border-orange-800/20 dark:border-orange-400/20" />
      <div className="absolute inset-16 rounded-full bg-orange-700 dark:bg-orange-500" />
      <div className="absolute inset-0 animate-[spin_30s_linear_infinite] motion-reduce:animate-none">
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-900 dark:bg-stone-100" />
      </div>
    </div>
  );
}

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-12 pb-24">
        <header className="py-12 grid md:grid-cols-[1.6fr_1fr] gap-10 items-center">
          <div>
            <h2 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
              Exploring the endless loop of code, design, and ideas.
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-400">
              Thoughts and tutorials from the center of the sphere.
            </p>
          </div>
          <Orbit />
        </header>

        {posts.length === 0 ? (
          <p className={`p-8 rounded-3xl text-stone-600 dark:text-stone-400 ${glass}`}>
            Nothing here yet. New posts will show up as soon as they are published.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link href={`/${post.slug}`} key={post.id} className="block">
                <article className={`group h-full p-8 rounded-3xl ${glass} ${glassHover}`}>
                  {post.category && (
                    <span className="text-sm font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400">
                      {post.category}
                    </span>
                  )}
                  <h3
                    style={{ fontFamily: fontFamilyFor(post.font) }}
                    className="text-2xl font-bold mt-3 mb-2 transition-colors group-hover:text-orange-700 dark:group-hover:text-orange-400"
                  >
                    {post.title}
                  </h3>
                  <p className="mb-6 line-clamp-3 text-stone-600 dark:text-stone-400">{excerpt(post.content)}</p>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {formatDate(post.createdAt)} • {readingTime(post.content)} min read
                  </span>
                </article>
              </Link>
            ))}
          </div>
        )}

        <section className={`mt-16 p-10 rounded-3xl text-center ${glass}`}>
          <h3 className="font-display text-3xl font-bold mb-4">Join the Sphere</h3>
          <p className="mb-6 text-stone-600 dark:text-stone-400">
            Get the latest posts delivered right to your inbox. No spam, just infinity.
          </p>
          <SubscribeForm />
        </section>
      </main>

      <SiteFooter />
      <FeedbackWidget />
    </div>
  );
}
