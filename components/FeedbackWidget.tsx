"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendFeedback } from "@/app/actions";
import type { FormState } from "@/lib/form-state";
import { inputClass, primaryBtn } from "@/lib/ui";

const initial: FormState = { status: "idle", message: "" };

// Mounted only while open, so every opening starts with a fresh form.
function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(sendFeedback, initial);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (state.status !== "success") return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [state.status, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white text-stone-900 dark:bg-[#1a1523] dark:border dark:border-white/10 dark:text-white"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="feedback-title" className="font-display text-2xl font-bold">
            Send Feedback
          </h3>
          <button onClick={onClose} aria-label="Close" className="opacity-60 hover:opacity-100 px-2">
            ✕
          </button>
        </div>

        {state.status === "success" ? (
          <div role="status" className="py-8 text-center text-green-700 dark:text-green-400 font-bold font-display text-xl">
            {state.message}
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <label htmlFor="feedback-message" className="sr-only">
              Your feedback
            </label>
            <textarea
              id="feedback-message"
              ref={textareaRef}
              name="message"
              required
              rows={4}
              maxLength={2000}
              placeholder="What's on your mind?"
              defaultValue={state.fields?.message}
              className={`${inputClass} resize-none`}
            />
            <label htmlFor="feedback-email" className="sr-only">
              Email (optional)
            </label>
            <input
              id="feedback-email"
              type="email"
              name="email"
              placeholder="Your email (optional, if you'd like a reply)"
              defaultValue={state.fields?.email}
              className={inputClass}
            />
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            {state.status === "error" && (
              <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
                {state.message}
              </p>
            )}
            <button type="submit" disabled={pending} className={`${primaryBtn} w-full`}>
              {pending ? "Sending..." : "Send to the Core"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-lg transition-transform hover:scale-105 bg-stone-900 text-white dark:bg-white/10 dark:border dark:border-white/20 dark:backdrop-blur-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
}
