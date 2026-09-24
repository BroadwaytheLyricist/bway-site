import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { formatPostDate, posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | Broadway The Lyricist",
  description:
    "Hip-Hop history, commentary, deep dives, and the conversations the culture should be having.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bg pb-24 pt-32 sm:pb-32 sm:pt-40">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          kicker="On The Record"
          title={
            <>
              The Hip-Hop <span className="text-accent">Conversations</span>
            </>
          }
        />

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          History, context, and commentary for the conversations that deserve
          more than a hot take.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex min-h-96 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel-2 p-7 transition-colors hover:border-accent/50 sm:p-10"
            >
              <div>
                {post.thumbnail && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative -mx-7 -mt-7 mb-8 block aspect-video overflow-hidden border-b border-line sm:-mx-10 sm:-mt-10 sm:mb-10"
                  >
                    <Image
                      src={post.thumbnail}
                      alt={`${post.title} video thumbnail`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </Link>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  <span>{post.category}</span>
                  <span className="h-1 w-1 rounded-full bg-muted" />
                  <time dateTime={post.publishedAt} className="text-muted">
                    {formatPostDate(post.publishedAt)}
                  </time>
                </div>

                <h2 className="mt-6 font-display text-4xl leading-[1.02] text-white sm:text-5xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors group-hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted">
                  {post.dek}
                </p>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-line pt-6 text-sm font-semibold">
                <span className="text-muted">{post.readTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-white transition-colors hover:text-accent"
                >
                  Read the story →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
