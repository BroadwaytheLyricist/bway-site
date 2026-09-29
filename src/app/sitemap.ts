import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod tied to substantive changes on each page.
  const currentPageUpdatedAt = "2026-09-29";
  const mediaKitUpdatedAt = "2026-09-28";
  const blogIndexUpdatedAt = "2026-09-28";
  const latestPostDate = posts.reduce(
    (latest, post) => post.publishedAt > latest ? post.publishedAt : latest,
    "",
  ) || blogIndexUpdatedAt;
  const latestBlogIndexDate = latestPostDate > blogIndexUpdatedAt ? latestPostDate : blogIndexUpdatedAt;
  return [
    {
      url: "https://broadwaythelyricist.com/",
      lastModified: currentPageUpdatedAt,
    },
    {
      url: "https://broadwaythelyricist.com/about",
      lastModified: currentPageUpdatedAt,
    },
    {
      url: "https://broadwaythelyricist.com/blog",
      lastModified: latestBlogIndexDate,
    },
    {
      url: "https://broadwaythelyricist.com/bar-lounge",
      lastModified: currentPageUpdatedAt,
    },
    ...posts.map((post) => ({
      url: `https://broadwaythelyricist.com/blog/${post.slug}`,
      lastModified: post.publishedAt,
    })),
    {
      url: "https://broadwaythelyricist.com/media-kit",
      lastModified: mediaKitUpdatedAt,
    },
    {
      url: "https://broadwaythelyricist.com/music",
      lastModified: currentPageUpdatedAt,
    },
  ];
}
