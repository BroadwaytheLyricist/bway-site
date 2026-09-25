import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { ArrowIcon } from "@/components/icons";
import { formatPostDate, posts } from "@/lib/posts";

export default function LatestBlog() {
  const post = posts[0];
  if (!post) return null;

  return (
    <section id="blog-preview" className="relative overflow-hidden bg-bg py-24 sm:py-32">
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
          className="pointer-events-none object-cover opacity-[0.11] blur-[3px] saturate-50"
        />
      )}
      <div className="absolute inset-0 bg-bg/88" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            index="02"
            kicker="From the Blog"
            title={<>More Than <span className="text-accent">The Video</span></>}
          />
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent">
            View all stories <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>

        <article className="group mt-12 grid overflow-hidden border border-line bg-panel lg:grid-cols-[1.15fr_1fr]">
          <Link href={`/blog/${post.slug}`} className="relative min-h-80 overflow-hidden lg:min-h-[30rem]">
            {post.thumbnail && (
              <Image
                src={post.thumbnail}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/65 via-transparent to-transparent" />
          </Link>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {post.category} <span className="px-2 text-muted">/</span> {formatPostDate(post.publishedAt)}
            </p>
            <h3 className="mt-5 font-display text-3xl leading-tight text-white sm:text-4xl">
              <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">{post.title}</Link>
            </h3>
            <p className="mt-5 text-base leading-relaxed text-muted">{post.dek}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{post.readTime}</p>
            <Link href={`/blog/${post.slug}`} className="mt-8 inline-flex w-fit items-center gap-3 border-b border-accent pb-2 text-sm font-bold uppercase tracking-[0.12em] text-white hover:text-accent">
              Read the story <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
