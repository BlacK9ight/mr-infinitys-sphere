import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-24">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">That page isn&apos;t here.</h1>
        <p className="mt-4 max-w-md text-stone-600 dark:text-stone-400">
          The link may be wrong, or the post may have been removed.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 rounded-xl font-display font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
        >
          Back to Orbit
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
