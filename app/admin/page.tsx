import { prisma } from "@/lib/prisma";
import { getAdminState } from "@/lib/admin";
import Tiptap from "@/components/Tiptap";
import FontPicker from "@/components/FontPicker";
import NotAuthorized from "@/components/NotAuthorized";
import { glass, glassHover, inputClass, labelClass, primaryBtn, subtleBtn } from "@/lib/ui";
import { createPost } from "./actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  missing: "Please fill in the title, the slug and some content.",
  reserved: "That slug is reserved. Please choose another one.",
  exists: "A post with that slug already exists. Please choose another one.",
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; error?: string }>;
}) {
  const state = await getAdminState();
  if (!state.admin) return <NotAuthorized userId={state.userId} configured={state.configured} />;

  const sp = await searchParams;
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, category: true },
  });

  return (
    <div>
      {sp.published && (
        <div role="status" className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-4 text-sm bg-green-700/10 border border-green-700/30 text-green-900 dark:text-green-300">
          <span>Published. Your post is live.</span>
          <a href={`/${sp.published}`} target="_blank" rel="noreferrer" className="font-bold underline">
            View post
          </a>
        </div>
      )}
      {sp.error && ERRORS[sp.error] && (
        <div role="alert" className="mb-6 p-4 rounded-2xl text-sm bg-red-700/10 border border-red-700/30 text-red-900 dark:text-red-300">
          {ERRORS[sp.error]}
        </div>
      )}

      {/* The key makes the form (and editor) start empty again after each publish */}
      <form key={sp.published ?? "new"} action={createPost} className={`flex flex-col gap-6 p-8 rounded-3xl ${glass}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" type="text" name="title" placeholder="e.g. The Future of AI" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className={labelClass}>URL slug</label>
            <input id="slug" type="text" name="slug" placeholder="the-future-of-ai" required className={`${inputClass} font-mono text-sm`} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className={labelClass}>Category (optional)</label>
          <input id="category" type="text" name="category" list="category-suggestions" maxLength={40} placeholder="e.g. Architecture" className={inputClass} />
          <datalist id="category-suggestions">
            <option value="Architecture" />
            <option value="Design" />
            <option value="Tutorial" />
            <option value="Ideas" />
            <option value="Notes" />
          </datalist>
        </div>

        <FontPicker />

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Content</span>
          <Tiptap />
        </div>

        <button type="submit" className={`${primaryBtn} self-start`}>
          Publish post
        </button>
      </form>

      <section className="mt-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Published posts</h2>
          <span className="text-sm text-stone-600 dark:text-stone-400">{posts.length} total</span>
        </div>

        {posts.length === 0 ? (
          <p className={`p-8 rounded-3xl text-stone-600 dark:text-stone-400 ${glass}`}>
            No posts yet. Write your first one above.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className={`p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${glass} ${glassHover}`}>
                <div className="min-w-0">
                  {post.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400">
                      {post.category}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-lg truncate">{post.title}</h3>
                  <p className="text-sm font-mono text-stone-600 dark:text-stone-400">/{post.slug}</p>
                </div>
                <a href={`/${post.slug}`} target="_blank" rel="noreferrer" className={`${subtleBtn} text-center`}>
                  View post
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
