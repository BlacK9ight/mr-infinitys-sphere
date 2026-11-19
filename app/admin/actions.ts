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

export async function createPost(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? ""));
  const content = String(formData.get("content") ?? "");
  const category = String(formData.get("category") ?? "").trim().slice(0, 40);
  const fontRaw = String(formData.get("font") ?? "");
  const font = isFontKey(fontRaw) ? fontRaw : DEFAULT_FONT;

  if (!title || !slug || isBlank(content)) redirect("/admin?error=missing");
  if (RESERVED_SLUGS.includes(slug)) redirect("/admin?error=reserved");

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) redirect("/admin?error=exists");

  await prisma.post.create({
    data: { title, slug, content, category, font, published: true },
  });

  // redirect() works by throwing, so it must stay outside any try/catch.
  redirect(`/admin?published=${encodeURIComponent(slug)}`);
}

export async function deleteFeedback(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.feedback.deleteMany({ where: { id } });
  revalidatePath("/admin/messages");
}

export async function deleteSubscriber(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.subscriber.deleteMany({ where: { id } });
  revalidatePath("/admin/messages");
}
