"use client";

import Card from "@/components/blogs/Card";
import { motion } from "motion/react";

export default function BlogCard({ post, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className="h-full"
    >
      <Card
        slug={post?.slug || ""}
        imageUrl={post?.cover || "/imgs/more-stories.avif"}
        category={post?.category || "Featured"}
        date={
          post?.date
            ? (() => {
                const parsed = new Date(post.date);
                return Number.isNaN(parsed.valueOf())
                  ? post.date
                  : parsed.toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    });
              })()
            : ""
        }
        title={post?.title || "Untitled post"}
        authorName={post?.author || "Natalie Segal"}
        authorImageUrl={post?.authorAvatar || "/imgs/author.avif"}
        views={Number(post?.views || 0).toLocaleString()}
        comments={Number(post?.comments || 0).toLocaleString()}
      />
    </motion.div>
  );
}
