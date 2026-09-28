import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  // Update this after a substantive homepage or Media Kit content change.
  const siteUpdatedAt = "2026-09-28";
  const latestPostDate = posts.reduce(
    (latest, post) => post.publishedAt > latest ? post.publishedAt : latest,
    "",
  ) || siteUpdatedAt;
  const blogIndexUpdatedAt = latestPostDate > siteUpdatedAt ? latestPostDate : siteUpdatedAt;
  return [
    {
      url: "https://broadwaythelyricist.com/",
      lastModified: siteUpdatedAt,
    },
    {
      url: "https://broadwaythelyricist.com/about",
      lastModified: siteUpdatedAt,
    },
    {
      url: "https://broadwaythelyricist.com/blog",
      lastModified: blogIndexUpdatedAt,
    },
    ...posts.map((post) => ({
      url: `https://broadwaythelyricist.com/blog/${post.slug}`,
      lastModified: post.publishedAt,
    })),
    {
      url: "https://broadwaythelyricist.com/media-kit",
      lastModified: siteUpdatedAt,
    },
    {
      url: "https://broadwaythelyricist.com/music",
      lastModified: siteUpdatedAt,
    },
  ];
}
