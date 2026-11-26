import { fontFamilyFor } from "@/lib/fonts";
import { formatDate, readingTime } from "@/lib/text";

type ArticlePost = {
  title: string;
  content: string;
  category: string;
  font: string;
  createdAt: Date;
};

// One place that draws a post, used by the public page and the admin preview.
export default function PostArticle({ post }: { post: ArticlePost }) {
  return (
    <article style={{ fontFamily: fontFamilyFor(post.font) }}>
      {post.category && (
        <span className="text-sm font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400">
          {post.category}
        </span>
      )}
      <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">{post.title}</h1>
      <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
        {formatDate(post.createdAt)} • {readingTime(post.content)} min read
      </p>

      {/* Post HTML comes from the admin editor only (see lib/admin.ts). */}
      <div
        className="mt-10 prose prose-lg prose-stone dark:prose-invert max-w-none prose-a:text-orange-800 dark:prose-a:text-orange-400 prose-blockquote:border-orange-700 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
