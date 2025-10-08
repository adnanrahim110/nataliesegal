"use client";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import Button from "../ui/Button";
import SectionSubtitle from "../ui/SectionSubtitle";
import SectionTitle from "../ui/SectionTitle";

const Book = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gradient-to-b from-white via-primary-50/40 bg-white"
    >
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-12 md:gap-16 md:grid-cols-2">
          <div className="relative w-full mx-auto">
            <div className="pointer-events-none absolute -left-12 -top-10 h-56 w-56 rounded-full bg-primary-300/40 blur-3xl md:h-72 md:w-72" />
            <Image
              src="/imgs/bookcover.png"
              alt="Book cover"
              width={800}
              height={1066}
              priority={false}
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 44vw, 90vw"
              style={{ width: "100%", height: "auto" }}
              className="object-contain shadow-2xl ring-1 ring-black/5 bg-white"
            />
          </div>

          <div className="space-y-6">
            <SectionSubtitle className="bg-white/60">
              Inside the Story
            </SectionSubtitle>

            <SectionTitle as="h2" size="section">
              Where Secrets, Faith, and Power Collide
            </SectionTitle>

            <div className="space-y-2">
              <p className="text-neutral-700 max-w-xl">
                From Hartford crime scenes to ancient curses, every thread pulls
                tighter as Miriam, Hannah, and Rose realize their lives are
                linked by something far older than coincidence.
              </p>
              <p className="text-neutral-700 max-w-xl">
                A ritual killing, a whisper of black magic, and a scholar who
                knows too much. Each chapter unravels one truth: the past never
                really dies, and neither do its monsters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button href="/contact">Buy Now</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Book;
