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
            <SectionSubtitle>Author Insight</SectionSubtitle>
            <SectionTitle as="h2" size="section">
              The Mind Behind the Magic
            </SectionTitle>
            <p className="text-neutral-700 max-w-xl">
              Natalie Segal came to fiction after years as a technical writer
              and teacher. She brings that precision to her storytelling,
              grounded, intelligent, and deeply human. When she isn’t writing
              contemporary fantasy or haiku, she’s dancing the rumba or watching
              birds. Heroes of the Middle Ages is her first novel, written with
              the care of someone who understands both science and wonder.
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
