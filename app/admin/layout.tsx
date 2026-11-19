import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminTabs from "@/components/AdminTabs";
import { getAdminState } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin } = await getAdminState();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-12 pb-24">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold tracking-tight">Admin</h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">Write posts and read what visitors send.</p>
        </div>
        {admin && <AdminTabs />}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
