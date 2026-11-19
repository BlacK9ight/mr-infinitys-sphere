import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-black/5 bg-white/20 dark:border-white/10 dark:bg-black/20">
      <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          {/* The logo turns half a circle when you hover the site name, as in the first version */}
          <span className="transition-transform duration-700 group-hover:rotate-180 motion-reduce:transition-none">
            <Logo />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">Mr. Infinity&apos;s Sphere</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
