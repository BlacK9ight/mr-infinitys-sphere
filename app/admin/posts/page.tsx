import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminState } from "@/lib/admin";
import NotAuthorized from "@/components/NotAuthorized";
import ConfirmButton from "@/components/ConfirmButton";
import { formatDate } from "@/lib/text";
import { dangerBtn, glass, glassHover, subtleBtn } from "@/lib/ui";
import { deletePost, setPublished } from "../actions";

export const dynamic = "force-dynamic";

const NOTICES: Record<string, string> = {
  saved: "Changes saved.",
  published: "Post published. It is now live.",
  unpublished: "Moved to drafts. It is no longer public.",
  deleted: "Post deleted.",
};

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const state = await getAdminState();
  if (!state.admin) return <NotAuthorized userId={state.userId} configured={state.configured} />;

  const { notice } = await searchParams;
  // Titles and dates only, so images inside posts are not loaded for the list.
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, category: true, published: true, updatedAt: true },
  });

  return (
    <div>
      {notice && NOTICES[notice] && (
        <div role="status" className="mb-6 p-4 rounded-2xl text-sm bg-green-700/10 border border-green-700/30 text-green-900 dark:text-green-300">
          {NOTICES[notice]}
        </div>
      )}
      {notice === "empty" && (
        <div role="alert" className="mb-6 p-4 rounded-2xl text-sm bg-red-700/10 border border-red-700/30 text-red-900 dark:text-red-300">
          That draft has no content yet, so it can&apos;t be published. Open it and add some first.
        </div>
      )}

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl font-bold">All posts</h2>
        <span className="text-sm text-stone-600 dark:text-stone-400">{posts.length} total</span>
      </div>

      {posts.length === 0 ? (
        <p className={`p-8 rounded-3xl text-stone-600 dark:text-stone-400 ${glass}`}>
          No posts yet. Write your first one on the Write tab.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div key={post.id} className={`p-5 rounded-2xl flex flex-col gap-4 ${glass} ${glassHover}`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-green-700/15 text-green-900 dark:text-green-300"
                        : "bg-amber-700/15 text-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  {post.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400">
                      {post.category}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-display font-bold text-lg truncate">{post.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  <span className="font-mono">/{post.slug}</span> · edited {formatDate(post.updatedAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/posts/${post.id}/edit`} className={subtleBtn}>Edit</Link>
                {post.published ? (
                  <a href={`/${post.slug}`} target="_blank" rel="noreferrer" className={subtleBtn}>View live</a>
                ) : (
                  <Link href={`/admin/preview/${post.id}`} className={subtleBtn}>Preview</Link>
                )}
                <form action={setPublished}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="publish" value={post.published ? "0" : "1"} />
                  <button type="submit" className={subtleBtn}>{post.published ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <ConfirmButton message={`Delete "${post.title}" for good? This cannot be undone.`} className={dangerBtn}>
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
