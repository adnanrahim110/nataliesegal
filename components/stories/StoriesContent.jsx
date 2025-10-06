"use client";

import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "motion/react";
import Image from "next/image";

export default function StoriesContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-neutral-200/60" />
      <div className="container py-16 md:pb-24 md:pt-20">
        <div className="space-y-4 text-center mb-20">
          <SectionSubtitle align="center">Stories</SectionSubtitle>
          <SectionTitle
            as="h1"
            size="hero"
            align="center"
            fullWidth
            underlineWidth="w-20 md:w-28"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            Stories
          </SectionTitle>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <figure className="relative w-full md:float-right md:w-[26rem] md:ml-6 md:mb-2">
            <Image
              src="/imgs/stories.avif"
              alt="My Beautiful Vampire"
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 26rem, 100vw"
              style={{ width: "100%", height: "auto" }}
              className="rounded-xl shadow-xl ring-1 ring-black/5 object-cover"
              priority={false}
            />
            <figcaption className="mt-2 text-sm text-neutral-600">
              Song Hays Chinese Restaurant.
            </figcaption>
          </figure>

          <div className="mt-6 space-y-2">
            <SectionSubtitle align="left">Short Story</SectionSubtitle>
            <SectionTitle
              as="h2"
              size="section"
              align="left"
              underlineWidth="w-16"
              accentClassName="bg-primary-400"
            >
              My Beautiful Vampire
            </SectionTitle>
          </div>

          <div className="mt-6 space-y-6 text-neutral-800 text-[17px] md:text-lg leading-relaxed">
            <p>
              San needed the Vampire, the one who called himself Peter Smith. He
              sat there toward the back wall of Song Hays Chinese Restaurant as
              if he belonged in the dimly lit room with the red flocked wall
              paper and the gilt-framed Asian paintings of birds. He sipped egg
              drop soup just like a Human, and he swallowed it, too.
            </p>
            <blockquote className="my-4 border-l-4 border-primary-300/70 pl-4 italic text-neutral-800/90">
              “Every Saturday night,” she said. “Song Hays. Mr. Smith likes
              Chinese.”
            </blockquote>
            <p>
              San didn’t understand what a Vampire, a dead being, would do with
              Chinese food or any food for that matter. She’d wanted to argue
              with the Curandera or make jokes about whether he preferred his
              drinks male or female, tall or short. But she needed the healer
              who was teaching her about magic and magical beings, not to
              mention that the older woman had no sense of humor that San had
              seen. So no challenges and no jokes.
            </p>
          </div>
        </motion.article>
      </div>
    </motion.section>
  );
}
