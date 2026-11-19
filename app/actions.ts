"use server";

import { prisma } from "@/lib/prisma";
import type { FormState } from "@/lib/form-state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HOUR = 60 * 60 * 1000;

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  // Hidden "company" field: people never see it, bots fill it in.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success", message: "You're in. Welcome to the Sphere." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid email address.", fields: { email } };
  }

  try {
    // Overall limit, so a script can't flood the list.
    const recent = await prisma.subscriber.count({
      where: { createdAt: { gt: new Date(Date.now() - HOUR) } },
    });
    if (recent >= 100) {
      return { status: "error", message: "Too many sign-ups right now. Please try again later.", fields: { email } };
    }
    // Same address twice is fine: it just stays on the list once.
    await prisma.subscriber.upsert({ where: { email }, update: {}, create: { email } });
  } catch {
    return { status: "error", message: "Something went wrong. Please try again.", fields: { email } };
  }

  return { status: "success", message: "You're in. Welcome to the Sphere." };
}

export async function sendFeedback(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success", message: "Thanks for your thoughts!" };
  }

  const message = String(formData.get("message") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fields = { message, email };

  if (!message) return { status: "error", message: "Write a message first.", fields };
  if (message.length > 2000) {
    return { status: "error", message: "Please keep it under 2,000 characters.", fields };
  }
  if (email && (email.length > 254 || !EMAIL_RE.test(email))) {
    return { status: "error", message: "That email address doesn't look right. You can also leave it empty.", fields };
  }

  try {
    const recent = await prisma.feedback.count({
      where: { createdAt: { gt: new Date(Date.now() - HOUR) } },
    });
    if (recent >= 50) {
      return { status: "error", message: "Too much feedback at once. Please try again later.", fields };
    }
    await prisma.feedback.create({ data: { message, email } });
  } catch {
    return { status: "error", message: "Something went wrong. Please try again.", fields };
  }

  return { status: "success", message: "Thanks for your thoughts!" };
}
