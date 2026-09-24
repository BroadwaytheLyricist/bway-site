import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoEmbed from "@/components/VideoEmbed";
import { formatPostDate, getPost, posts } from "@/lib/posts";

function renderInline(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: `${post.title} | Broadway The Lyricist`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Broadway The Lyricist"],
      url: `/blog/${post.slug}`,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              alt: `${post.title} video thumbnail`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const url = `https://broadwaythelyricist.com/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      "@id": "https://broadwaythelyricist.com/#person",
      name: "Broadway The Lyricist",
      url: "https://broadwaythelyricist.com",
    },
    publisher: {
      "@id": "https://broadwaythelyricist.com/#person",
    },
  };

  return (
    <article className="min-h-screen bg-bg pb-24 pt-28 sm:pb-32 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto max-w-5xl px-5 sm:px-8">
        <Link
          href="/blog"
          className="text-sm font-semibold text-muted transition-colors hover:text-accent"
        >
          ← Back to the blog
        </Link>
        <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span>{post.category}</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <time dateTime={post.publishedAt} className="text-muted">
            {formatPostDate(post.publishedAt)}
          </time>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span className="text-muted">{post.readTime}</span>
        </div>
        <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[0.96] text-white sm:text-6xl lg:text-8xl">
          {post.title}
        </h1>
        <p className="mt-7 max-w-3xl text-xl italic leading-8 text-muted sm:text-2xl sm:leading-9">
          {post.dek}
        </p>
        <div className="mt-12 h-px bg-gradient-to-r from-accent via-accent/40 to-transparent" />
      </header>

      {post.youtubeId && (
        <div className="mx-auto mt-10 max-w-5xl px-5 sm:mt-14 sm:px-8">
          <VideoEmbed
            embedUrl={`https://www.youtube.com/embed/${post.youtubeId}`}
            title={post.title}
          />
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl px-5 sm:mt-16 sm:px-8">
        <div className="space-y-7 text-[1.06rem] leading-8 text-[#d8dde6] sm:text-lg sm:leading-9">
          {post.opening.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "font-display text-4xl leading-none text-accent sm:text-5xl"
                  : undefined
              }
            >
              {renderInline(paragraph)}
            </p>
          ))}

          {post.sections.map((section) => (
            <section key={section.heading} className="pt-8 sm:pt-12">
              {section.heading && (
                <h2 className="mb-7 font-display text-4xl leading-none text-white sm:text-5xl">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-7">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{renderInline(paragraph)}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <blockquote className="mt-16 border-l-4 border-accent bg-panel-2 px-6 py-8 font-display text-3xl leading-tight text-white sm:px-9 sm:text-4xl">
          {post.closing}
        </blockquote>

        <div className="mt-12 border-t border-line pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Written by Broadway The Lyricist
          </p>
        </div>
      </div>
    </article>
  );
}
