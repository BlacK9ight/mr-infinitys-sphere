"use client";

import { useState } from "react";
import { FONT_OPTIONS, DEFAULT_FONT } from "@/lib/fonts";
import { labelClass } from "@/lib/ui";

export default function FontPicker() {
  const [value, setValue] = useState<string>(DEFAULT_FONT);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className={`${labelClass} mb-2`}>Post font</legend>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FONT_OPTIONS.map((f) => (
          <label
            key={f.key}
            className={`cursor-pointer rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-orange-700 dark:focus-within:ring-orange-400 ${
              value === f.key
                ? "border-orange-700 bg-orange-700/10 dark:border-orange-400 dark:bg-orange-400/10"
                : "border-black/10 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-black/30 dark:hover:bg-white/5"
            }`}
          >
            <input
              type="radio"
              name="font"
              value={f.key}
              checked={value === f.key}
              onChange={(e) => {
                setValue(f.key);
                // The editor reads this variable, so it previews the chosen font while you write.
                e.currentTarget.form?.style.setProperty("--post-font", f.family);
              }}
              className="sr-only"
            />
            <span className="block text-2xl text-stone-900 dark:text-white" style={{ fontFamily: f.family }}>
              Aa Bb
            </span>
            <span className="block text-sm font-medium mt-2 text-stone-800 dark:text-stone-200">{f.label}</span>
            <span className="block text-xs text-stone-600 dark:text-stone-400">{f.note}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
