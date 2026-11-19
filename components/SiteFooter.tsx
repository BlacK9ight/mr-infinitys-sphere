export default function SiteFooter() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-10 text-sm text-stone-600 dark:text-stone-400">
        © {new Date().getFullYear()} Mr. Infinity&apos;s Sphere
      </div>
    </footer>
  );
}
