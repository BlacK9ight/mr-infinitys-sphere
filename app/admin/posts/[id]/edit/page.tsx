import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminState } from "@/lib/admin";
import PostForm from "@/components/PostForm";
import NotAuthorized from "@/components/NotAuthorized";
import { updatePost } from "../../../actions";
import { POST_ERRORS } from "@/lib/post-errors";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const state = await getAdminState();
  if (!state.admin) return <NotAuthorized userId={state.userId} configured={state.configured} />;

  const { id } = await params;
  const { error } = await searchParams;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin/posts" className="text-sm font-bold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
          ← All posts
        </Link>
        <span className="text-sm text-stone-600 dark:text-stone-400">{post.published ? "Published" : "Draft"}</span>
      </div>

      {error && POST_ERRORS[error] && (
        <div role="alert" className="mb-6 p-4 rounded-2xl text-sm bg-red-700/10 border border-red-700/30 text-red-900 dark:text-red-300">
          {POST_ERRORS[error]}
        </div>
      )}

      <PostForm
        action={updatePost}
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          category: post.category,
          font: post.font,
          published: post.published,
        }}
      />
    </div>
  );
}
