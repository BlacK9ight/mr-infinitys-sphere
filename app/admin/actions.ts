"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminState } from "@/lib/admin";
import { RESERVED_SLUGS, isBlank, slugify } from "@/lib/text";
import { DEFAULT_FONT, isFontKey } from "@/lib/fonts";

// Server Actions can be called directly, so every one checks again. The page check alone is not enough.
async function requireAdmin() {
  const { admin } = await getAdminState();
  if (!admin) throw new Error("Not authorized");
}

// The public pages are cached for speed, so tell Next.js to rebuild them after any change to posts.
function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/[slug]", "page");
}

function parsePostForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const fontRaw = String(formData.get("font") ?? "");
  return {
    title,
    // An empty slug falls back to the title.
    slug: slugify(String(formData.get("slug") ?? "")) || slugify(title),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? "").trim().slice(0, 40),
    font: isFontKey(fontRaw) ? fontRaw : DEFAULT_FONT,
    intent: String(formData.get("intent") ?? ""),
  };
}

// Returns an error code, or null when the post is fine. Drafts may be unfinished; published posts may not.
function validate(data: { title: string; slug: string; content: string }, publishing: boolean) {
  if (!data.title || !data.slug) return "missing";
  if (RESERVED_SLUGS.includes(data.slug)) return "reserved";
  if (publishing && isBlank(data.content)) return "empty";
  return null;
}

export async function createPost(formData: FormData) {
  await requireAdmin();

  const data = parsePostForm(formData);
  const publishing = data.intent === "publish";

  const problem = validate(data, publishing);
  if (problem) redirect(`/admin?error=${problem}`);

  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  if (existing) redirect("/admin?error=exists");

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      category: data.category,
      font: data.font,
      published: publishing,
    },
  });

  refreshPublicPages();

  // redirect() works by throwing, so it must stay outside any try/catch.
  if (publishing) redirect(`/admin?published=${encodeURIComponent(post.slug)}`);
  redirect(`/admin?draft=${post.id}`);
}

export async function updatePost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const current = await prisma.post.findUnique({ where: { id }, select: { published: true } });
  if (!current) redirect("/admin/posts");

  const data = parsePostForm(formData);
  const published =
    data.intent === "publish" ? true : data.intent === "draft" ? false : current.published;

  const problem = validate(data, published);
  if (problem) redirect(`/admin/posts/${id}/edit?error=${problem}`);

  const clash = await prisma.post.findFirst({ where: { slug: data.slug, NOT: { id } } });
  if (clash) redirect(`/admin/posts/${id}/edit?error=exists`);

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      category: data.category,
      font: data.font,
      published,
    },
  });

  refreshPublicPages();

  const notice =
    data.intent === "publish" ? "published" : data.intent === "draft" && current.published ? "unpublished" : "saved";
  redirect(`/admin/posts?notice=${notice}`);
}

export async function setPublished(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const publish = String(formData.get("publish") ?? "") === "1";

  const post = await prisma.post.findUnique({ where: { id }, select: { content: true } });
  if (!post) redirect("/admin/posts");
  if (publish && isBlank(post.content)) redirect("/admin/posts?notice=empty");

  await prisma.post.update({ where: { id }, data: { published: publish } });
  refreshPublicPages();
  redirect(`/admin/posts?notice=${publish ? "published" : "unpublished"}`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.post.deleteMany({ where: { id } });
  refreshPublicPages();
  redirect("/admin/posts?notice=deleted");
}

export async function deleteFeedback(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.feedback.deleteMany({ where: { id } });
  redirect("/admin/messages");
}

export async function deleteSubscriber(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.subscriber.deleteMany({ where: { id } });
  redirect("/admin/messages");
}
