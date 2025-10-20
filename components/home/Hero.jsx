"use client";

import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import Button from "../ui/Button";
import SectionSubtitle from "../ui/SectionSubtitle";
import SectionTitle from "../ui/SectionTitle";

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gradient-to-b from-primary-50/70 to-white"
    >
      <div className="container py-16 md:py-28">
        <div className="grid items-center gap-12 md:gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <SectionSubtitle>Heroes of the Middle Ages</SectionSubtitle>

            <SectionTitle as="h1" size="hero">
              A Story of Magic, Mortality, and Connection
            </SectionTitle>

            <p className="text-neutral-700 max-w-xl">
              Heroes of the Middle Ages weaves the old and the modern into a
              spellbinding tale of blood, faith, and hidden power where family
              ties cross centuries and magic leaves a mark that reason can’t
              erase.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button href="/about">Learn more</Button>
              <Button tone="dark" href="/blogs">
                Read Stories
              </Button>
            </div>
          </div>

          <div className="relative w-full ml-auto md:ml-auto max-w-[16rem] sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-[32rem] aspect-[301/393]">
            <div className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 rounded-full bg-primary-300/40 blur-3xl md:h-72 md:w-72" />
            <Image
              src="/imgs/author.avif"
              alt="Natalie Segal portrait"
              fill
              priority
              sizes="(min-width: 1024px) 24rem, (min-width: 768px) 22rem, (min-width: 640px) 18rem, 16rem"
              className="object-contain rounded-xl shadow-2xl ring-1 ring-black/5"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
