import Tiptap from "@/components/Tiptap";
import FontPicker from "@/components/FontPicker";
import { fontFamilyFor } from "@/lib/fonts";
import { glass, inputClass, labelClass, primaryBtn, secondaryBtn } from "@/lib/ui";

export type PostFormValues = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  font: string;
  published: boolean;
};

// The same form for writing a new post and editing an existing one.
export default function PostForm({
  action,
  post,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: PostFormValues;
}) {
  return (
    <form
      action={action}
      style={post ? ({ "--post-font": fontFamilyFor(post.font) } as React.CSSProperties) : undefined}
      className={`flex flex-col gap-6 p-8 rounded-3xl ${glass}`}
    >
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" type="text" name="title" defaultValue={post?.title} placeholder="e.g. The Future of AI" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className={labelClass}>URL slug</label>
          <input id="slug" type="text" name="slug" defaultValue={post?.slug} placeholder="Leave empty to use the title" className={`${inputClass} font-mono text-sm`} />
          {post?.published && (
            <p className="text-xs text-stone-600 dark:text-stone-400">Changing the slug changes this post&apos;s web address.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className={labelClass}>Category (optional)</label>
        <input id="category" type="text" name="category" list="category-suggestions" defaultValue={post?.category} maxLength={40} placeholder="e.g. Architecture" className={inputClass} />
        <datalist id="category-suggestions">
          <option value="Architecture" />
          <option value="Design" />
          <option value="Tutorial" />
          <option value="Ideas" />
          <option value="Notes" />
        </datalist>
      </div>

      <FontPicker defaultValue={post?.font} />

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Content</span>
        <Tiptap initialContent={post?.content} />
      </div>

      <div className="flex flex-wrap gap-3">
        {!post && (
          <>
            <button type="submit" name="intent" value="publish" className={primaryBtn}>Publish post</button>
            <button type="submit" name="intent" value="draft" className={secondaryBtn}>Save as draft</button>
          </>
        )}
        {post && post.published && (
          <>
            <button type="submit" name="intent" value="save" className={primaryBtn}>Save changes</button>
            <button type="submit" name="intent" value="draft" className={secondaryBtn}>Move to drafts</button>
          </>
        )}
        {post && !post.published && (
          <>
            <button type="submit" name="intent" value="publish" className={primaryBtn}>Publish post</button>
            <button type="submit" name="intent" value="save" className={secondaryBtn}>Save draft</button>
          </>
        )}
      </div>
    </form>
  );
}
