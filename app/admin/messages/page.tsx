import { prisma } from "@/lib/prisma";
import { getAdminState } from "@/lib/admin";
import NotAuthorized from "@/components/NotAuthorized";
import CopyEmails from "@/components/CopyEmails";
import { formatDate } from "@/lib/text";
import { glass, subtleBtn } from "@/lib/ui";
import { deleteFeedback, deleteSubscriber } from "../actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const state = await getAdminState();
  if (!state.admin) return <NotAuthorized userId={state.userId} configured={state.configured} />;

  const [feedback, subscribers] = await Promise.all([
    prisma.feedback.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="flex flex-col gap-16">
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Feedback</h2>
          <span className="text-sm text-stone-600 dark:text-stone-400">{feedback.length} received</span>
        </div>

        {feedback.length === 0 ? (
          <p className={`p-8 rounded-3xl text-stone-600 dark:text-stone-400 ${glass}`}>
            No feedback yet. Messages sent from the chat button on the site show up here.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {feedback.map((f) => (
              <article key={f.id} className={`p-6 rounded-2xl ${glass}`}>
                <p className="whitespace-pre-wrap">{f.message}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600 dark:text-stone-400">
                  <span>
                    {formatDate(f.createdAt)}
                    {f.email && (
                      <>
                        {" "}from{" "}
                        <a href={`mailto:${f.email}`} className="font-bold underline text-orange-800 dark:text-orange-400">
                          {f.email}
                        </a>
                      </>
                    )}
                  </span>
                  <form action={deleteFeedback}>
                    <input type="hidden" name="id" value={f.id} />
                    <button type="submit" className={subtleBtn}>Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-baseline gap-4">
            <h2 className="font-display text-2xl font-bold">Subscribers</h2>
            <span className="text-sm text-stone-600 dark:text-stone-400">{subscribers.length} signed up</span>
          </div>
          {subscribers.length > 0 && <CopyEmails emails={subscribers.map((s) => s.email)} />}
        </div>

        {subscribers.length === 0 ? (
          <p className={`p-8 rounded-3xl text-stone-600 dark:text-stone-400 ${glass}`}>
            No subscribers yet. Emails from the "Join the Sphere" box show up here.
          </p>
        ) : (
          <ul className={`rounded-2xl divide-y divide-black/10 dark:divide-white/10 ${glass}`}>
            {subscribers.map((s) => (
              <li key={s.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.email}</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Joined {formatDate(s.createdAt)}</p>
                </div>
                <form action={deleteSubscriber}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className={subtleBtn}>Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
