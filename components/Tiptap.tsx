"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";

// Shrinks big photos before they are embedded, so posts stay small enough to publish.
async function fileToDataUrl(file: File, maxWidth = 1400, quality = 0.82): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    // Fallback for formats the browser can't resize (e.g. SVG)
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export default function Tiptap({ initialContent = "" }: { initialContent?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
    ],
    content: initialContent, // An empty string lets the placeholder appear
    // Next.js renders on the server first; this avoids a hydration mismatch.
    immediatelyRender: false,
    // Keeps the toolbar highlights and the hidden form field in sync while typing.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        "aria-label": "Post content",
        class:
          "focus:outline-none min-h-[350px] p-6 rounded-b-xl border border-black/10 bg-white/60 text-stone-900 dark:border-white/10 dark:bg-black/30 dark:text-stone-200 prose prose-stone dark:prose-invert max-w-none [font-family:var(--post-font,inherit)]",
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const src = await fileToDataUrl(file);
    editor.chain().focus().setImage({ src }).run();
    event.target.value = ""; // lets you pick the same file again
  };

  const btnClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-stone-900 text-white dark:bg-orange-700"
        : "bg-black/5 text-stone-700 hover:bg-black/10 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10"
    }`;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2 p-3 rounded-t-xl border border-b-0 border-black/10 bg-white/40 dark:border-white/10 dark:bg-white/5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>Bold</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btnClass(editor.isActive("italic"))} italic`}>Italic</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>Bullet List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>Numbered List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive("codeBlock"))}>Code</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}>Divider</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}>Undo</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}>Redo</button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="ml-auto px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-800/40 text-orange-900 hover:bg-orange-700/10 dark:border-orange-400/40 dark:text-orange-300 dark:hover:bg-orange-400/10 transition-colors"
        >
          Add image
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>

      <EditorContent editor={editor} />

      <input type="hidden" name="content" value={editor.getHTML()} />
    </div>
  );
}
