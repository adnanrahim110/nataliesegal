"use client";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import Button from "../ui/Button";
import SectionSubtitle from "../ui/SectionSubtitle";
import SectionTitle from "../ui/SectionTitle";

const Author = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-white"
    >
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-12 md:gap-16 md:grid-cols-2">
          <div className="relative w-full mx-auto md:order-2">
            <div className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 rounded-full bg-primary-300/30 blur-3xl md:h-72 md:w-72" />
            <Image
              src="/imgs/author.avif"
              alt="Portrait of Natalie Segal"
              width={900}
              height={1125}
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 44vw, 90vw"
              style={{ width: "100%", height: "auto" }}
              className="object-cover rounded-xl shadow-2xl ring-1 ring-black/5"
              priority={false}
            />
          </div>

          <div className="space-y-6 md:order-1">
            <SectionSubtitle>About the Author</SectionSubtitle>
            <SectionTitle as="h2" size="section">
              Meet Natalie Segal
            </SectionTitle>
            <p className="text-neutral-700 max-w-xl">
              Natalie Segal is an author, speaker, and coach who helps people
              find courage and clarity through honest storytelling and practical
              tools. Drawing from years of experience working with individuals
              and groups, she writes with warmth and grounded insight, inviting
              readers to take small, compassionate steps toward meaningful
              change in everyday life.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/about">More about Natalie</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Author;
