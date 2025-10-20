"use client";

import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "motion/react";
import Image from "next/image";

export default function AboutContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-300/25 blur-3xl"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-neutral-200/60" />
      <div className="container py-16 md:py-24">
        <div className="space-y-4">
          <SectionSubtitle align="left">About</SectionSubtitle>
          <SectionTitle
            as="h1"
            size="text-2xl lg:text-[38px] xl:text-[43px]"
            align="left"
            fullWidth
            underlineWidth="w-24 md:w-32"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            “Stories aren’t about escape. They’re about recognition seeing a bit
            of ourselves in the impossible.”{" "}
            <span className="text-primary-500"> — Natalie Segal</span>
          </SectionTitle>
        </div>

        <div className="grid items-start gap-12 md:gap-16 md:grid-cols-2 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="relative w-full"
          >
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-2xl bg-primary-200/30 blur-2xl"
            />
            <Image
              src="/imgs/about.avif"
              alt="About Natalie Segal"
              width={1400}
              height={1750}
              sizes="(min-width: 1024px) 28rem, (min-width: 768px) 26rem, (min-width: 640px) 22rem, 20rem"
              style={{ width: "100%", height: "auto" }}
              className="rounded-xl shadow-2xl ring-1 ring-black/5 object-cover"
              priority={false}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="space-y-4 max-w-xl mx-auto md:mx-0"
          >
            <p className="text-neutral-700/90 text-[17px] md:text-lg leading-relaxed">
              A late-blooming storyteller, Natalie spent years as a technical
              writer and college instructor before giving herself permission to
              chase fiction full-time. After raising two daughters and a couple
              of cats, she turned her attention to contemporary fantasy where
              logic meets wonder, and ordinary people discover they’re capable
              of extraordinary things.
            </p>
            <p className="text-neutral-700/90 text-[17px] md:text-lg leading-relaxed">
              Her writing often blends humor, mystery, and empathy, inspired by
              the small details most of us overlook. She’s published short
              stories and haiku in Zahir, The MacGuffin, and Bottle Rockets.
              Heroes of the Middle Ages is her first novel a story that explores
              the uneasy border between reason and belief.
            </p>
            <p className="text-neutral-700/90 text-[17px] md:text-lg leading-relaxed">
              When she isn’t writing, Natalie dances the rumba, foxtrot, or East
              Coast swing, tends to her birdwatching lists, and reads fantasy
              and murder mysteries to relax (yes, that’s her version of calm).
            </p>
            <p className="font-mr-de text-6xl pb-8 -rotate-12 text-primary-700/90">
              Natalie Segal
            </p>

            <div className="pt-4">
              <div className="flex items-center gap-4 p-3 rounded-lg border border-primary-200 bg-primary-50/60 backdrop-blur-sm ring-1 ring-black/5">
                <Image
                  src="/imgs/authors-ass.avif"
                  alt="Connecticut Authors and Publishers Association"
                  width={100}
                  height={100}
                  className="rounded-md mix-blend-multiply"
                />
                <p className="text-xl font-noticia text-neutral-700">
                  Natalie is an active member of the Connecticut Authors and
                  Publishers Association.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
