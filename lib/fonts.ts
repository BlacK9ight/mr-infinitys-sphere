// The fonts a post can use. "family" is the CSS font-family value.
// Satoshi and Author load from Fontshare (see app/layout.tsx);
// the others come from the @fontsource-variable packages.
export const FONT_OPTIONS = [
  { key: "author", label: "Author", note: "The site's reading font", family: '"Author", ui-sans-serif, system-ui, sans-serif' },
  { key: "satoshi", label: "Satoshi", note: "Crisp and geometric", family: '"Satoshi", ui-sans-serif, system-ui, sans-serif' },
  { key: "sans", label: "Figtree", note: "Clean and friendly", family: '"Figtree Variable", ui-sans-serif, system-ui, sans-serif' },
  { key: "serif", label: "Lora", note: "Classic book feel", family: '"Lora Variable", Georgia, serif' },
  { key: "soft", label: "Fraunces", note: "Warm and characterful", family: '"Fraunces Variable", Georgia, serif' },
  { key: "editorial", label: "Playfair Display", note: "Sharp and editorial", family: '"Playfair Display Variable", Georgia, serif' },
  { key: "tech", label: "Space Grotesk", note: "Technical and bold", family: '"Space Grotesk Variable", ui-sans-serif, system-ui, sans-serif' },
  { key: "mono", label: "JetBrains Mono", note: "Looks like code", family: '"JetBrains Mono Variable", ui-monospace, monospace' },
] as const;

export type FontKey = (typeof FONT_OPTIONS)[number]["key"];
export const DEFAULT_FONT: FontKey = "author";

export function isFontKey(key: string): key is FontKey {
  return FONT_OPTIONS.some((f) => f.key === key);
}

export function fontFamilyFor(key: string | null | undefined) {
  return (FONT_OPTIONS.find((f) => f.key === key) ?? FONT_OPTIONS[0]).family;
}
