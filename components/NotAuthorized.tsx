import { glass } from "@/lib/ui";

export default function NotAuthorized({ userId, configured }: { userId: string | null; configured: boolean }) {
  return (
    <div className={`max-w-xl mx-auto text-center p-8 rounded-3xl ${glass}`}>
      <h2 className="font-display text-2xl font-bold mb-3">Not authorized</h2>
      <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
        {configured
          ? "This account is not allowed to use the admin area."
          : "No admin has been set up yet. Add this ID as the ADMIN_CLERK_USER_ID environment variable, then restart the server:"}
      </p>
      {!configured && userId && (
        <code className="block break-all rounded-xl p-3 text-sm bg-black/10 text-orange-900 dark:bg-black/40 dark:text-orange-300">
          {userId}
        </code>
      )}
    </div>
  );
}
