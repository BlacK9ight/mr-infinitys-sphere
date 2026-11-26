import Link from "next/link";
import { getAdminState } from "@/lib/admin";
import PostForm from "@/components/PostForm";
import NotAuthorized from "@/components/NotAuthorized";
import { POST_ERRORS } from "@/lib/post-errors";
import { createPost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; draft?: string; error?: string }>;
}) {
  const state = await getAdminState();
  if (!state.admin) return <NotAuthorized userId={state.userId} configured={state.configured} />;

  const sp = await searchParams;

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
      {sp.draft && (
        <div role="status" className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-4 text-sm bg-amber-700/10 border border-amber-700/30 text-amber-900 dark:text-amber-300">
          <span>Draft saved. It is not public yet.</span>
          <Link href={`/admin/posts/${sp.draft}/edit`} className="font-bold underline">
            Keep editing
          </Link>
        </div>
      )}
      {sp.error && POST_ERRORS[sp.error] && (
        <div role="alert" className="mb-6 p-4 rounded-2xl text-sm bg-red-700/10 border border-red-700/30 text-red-900 dark:text-red-300">
          {POST_ERRORS[sp.error]}
        </div>
      )}

      {/* The key makes the form (and editor) start empty again after each save */}
      <PostForm key={sp.published ?? sp.draft ?? "new"} action={createPost} />
    </div>
  );
}
