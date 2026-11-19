// Slugs that would clash with real routes.
export const RESERVED_SLUGS = ["admin", "api", "sign-in", "sign-up", "_next"];

/** "/My First Post!" -> "my-first-post" */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/^\/+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Removes HTML tags (including embedded base64 images) and tidies whitespace. */
export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(html: string, max = 160) {
  const text = stripHtml(html);
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export function readingTime(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** True when the editor produced no text and no image. */
export function isBlank(html: string) {
  return stripHtml(html) === "" && !html.includes("<img");
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
