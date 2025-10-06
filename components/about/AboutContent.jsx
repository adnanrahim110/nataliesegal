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
      {/* soft background glows */}
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
            align="left"
            fullWidth
            underlineWidth="w-24 md:w-32"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            Natalie Segal - Writer, teacher, swing dancer, observer of people
            (and all things avian.)
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
            {/* image glow */}
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
            className="space-y-6 max-w-xl mx-auto md:mx-0"
          >
            <p className="text-neutral-700/90 text-[17px] md:text-lg leading-relaxed">
              Welcome to the world of a late-blooming writer who used to work as
              a technical writer and a college teacher of first-year composition
              and technical writing. After raising two daughters, I write
              contemporary fantasy (with haiku and poetry on the side) with a
              space opera just for fun. I read fantasy (epic and contemporary
              and sometimes romantasy), with murder mysteries my method of
              calming myself to sleep. (I know, weird, but they work.)
            </p>
            <p className="text-neutral-700/90 text-[17px] md:text-lg leading-relaxed">
              I also dance (rumba, foxtrot, East Coast swing), birdwatch—and
              write. Did I mention I write? I’ve published short stories in
              Zahir, an online fantasy magazine, and The MacGuffin, along with
              haiku in Bottle Rockets. Novels will follow soon. Watch this space
              for more. Please go to the blog for more about me and commentary
              of books and writing. And thank you for visiting this page.
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
