"use client";

import BlogCard from "@/components/blogs/BlogCard";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { BLOG_POSTS } from "@/constants/blogs";
import { motion } from "motion/react";
import React from "react";

export default function BlogsList() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-neutral-200/60" />
      <div className="container py-16 md:py-24">
        <div className="space-y-4">
          <SectionSubtitle align="left">Blogs</SectionSubtitle>
          <SectionTitle
            as="h1"
            size="hero"
            align="left"
            fullWidth
            underlineWidth="w-20 md:w-28"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            Blogs
          </SectionTitle>
        </div>

        <div className="mt-10 grid gap-6 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, idx) => (
            <BlogCard
              key={post.id}
              post={{ ...post, href: `/blogs/${post.slug}` }}
              delay={0.05 * (idx % 3)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
