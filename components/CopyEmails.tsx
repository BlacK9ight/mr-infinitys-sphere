"use client";

import { useState } from "react";
import { subtleBtn } from "@/lib/ui";

export default function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; nothing else to do.
    }
  }

  return (
    <button type="button" onClick={copy} className={subtleBtn}>
      {copied ? "Copied" : "Copy all emails"}
    </button>
  );
}
