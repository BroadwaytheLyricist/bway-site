"use client";

import { useEffect, useState } from "react";
import { InstagramIcon } from "@/components/icons";
import { links } from "@/lib/site";

type InstagramPost = {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  thumbnailUrl: string | null;
  timestamp: string;
  username?: string;
};

type FeedState =
  | { status: "loading"; posts: InstagramPost[] }
  | { status: "ready"; posts: InstagramPost[] }
  | { status: "unavailable"; posts: InstagramPost[] };

export default function InstagramFeed() {
  const [feed, setFeed] = useState<FeedState>({ status: "loading", posts: [] });

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeed() {
      try {
        const response = await fetch("/api/instagram", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();

        if (!response.ok || !payload?.ok || !Array.isArray(payload.posts)) {
          setFeed({ status: "unavailable", posts: [] });
          return;
        }

        setFeed({ status: "ready", posts: payload.posts });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFeed({ status: "unavailable", posts: [] });
        }
      }
    }

    loadFeed();
    return () => controller.abort();
  }, []);

  if (feed.status === "loading") {
    return (
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Loading latest Instagram posts">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-xl border border-line bg-panel" />
        ))}
      </div>
    );
  }

  if (feed.status === "unavailable" || feed.posts.length === 0) {
    return (
      <a
        href={links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 flex items-center justify-between gap-5 rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/50"
      >
        <span className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <InstagramIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-xl text-white">Instagram</span>
            <span className="text-sm text-muted">See the latest from @broadwaythelyricist</span>
          </span>
        </span>
        <span className="text-sm font-semibold text-accent">Open Instagram →</span>
      </a>
    );
  }

  return (
    <div className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-5">
        <div>
          <p className="kicker">Latest on Instagram</p>
          <p className="mt-2 text-sm text-muted">@broadwaythelyricist</p>
        </div>
        <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white transition-colors hover:text-accent">
          View Instagram →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {feed.posts.slice(0, 6).map((post) => {
          const imageSrc = post.mediaType === "VIDEO" ? post.thumbnailUrl || post.mediaUrl : post.mediaUrl;
          return (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-panel"
              aria-label={post.caption ? `Instagram: ${post.caption.slice(0, 80)}` : "Open Instagram post"}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-accent"><InstagramIcon className="h-7 w-7" /></span>
              )}
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
