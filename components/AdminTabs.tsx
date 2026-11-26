"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Write", isActive: (p: string) => p === "/admin" },
  { href: "/admin/posts", label: "Posts", isActive: (p: string) => p.startsWith("/admin/posts") || p.startsWith("/admin/preview") },
  { href: "/admin/messages", label: "Messages", isActive: (p: string) => p.startsWith("/admin/messages") },
];

export default function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="mb-8 flex gap-6 border-b border-black/10 dark:border-white/10">
      {TABS.map((tab) => {
        const active = tab.isActive(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px pb-3 border-b-2 font-display font-bold transition-colors ${
              active
                ? "border-orange-700 text-stone-900 dark:border-orange-400 dark:text-white"
                : "border-transparent text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
