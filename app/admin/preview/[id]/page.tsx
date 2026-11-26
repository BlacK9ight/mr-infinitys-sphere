import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminState } from "@/lib/admin";
import NotAuthorized from "@/components/NotAuthorized";
import PostArticle from "@/components/PostArticle";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const state = await getAdminState();
  if (!state.admin) return <NotAuthorized userId={state.userId} configured={state.configured} />;

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <div className="mb-10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-sm bg-amber-700/10 border border-amber-700/30 text-amber-900 dark:text-amber-300">
        <span>
          {post.published ? "This post is live. This is how visitors see it." : "Draft preview. Only you can see this page."}
        </span>
        <span className="flex gap-4 font-bold">
          <Link href={`/admin/posts/${post.id}/edit`} className="underline">Edit</Link>
          <Link href="/admin/posts" className="underline">All posts</Link>
        </span>
      </div>

      <div className="max-w-3xl">
        <PostArticle post={post} />
      </div>
    </div>
  );
}
