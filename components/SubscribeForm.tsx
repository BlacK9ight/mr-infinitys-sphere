"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions";
import type { FormState } from "@/lib/form-state";
import { inputClass, primaryBtn } from "@/lib/ui";

const initial: FormState = { status: "idle", message: "" };

export default function SubscribeForm() {
  const [state, action, pending] = useActionState(subscribe, initial);

  return (
    <form action={action} className="relative max-w-md mx-auto">
      <div className="flex gap-2">
        <label htmlFor="subscribe-email" className="sr-only">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          name="email"
          required
          placeholder="hello@world.com"
          defaultValue={state.fields?.email}
          className={`flex-1 min-w-0 ${inputClass}`}
        />
        {/* Spam trap: invisible to people */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Joining..." : "Subscribe"}
        </button>
      </div>
      <p
        role="status"
        className={`mt-3 min-h-6 text-sm font-medium ${
          state.status === "error" ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}
