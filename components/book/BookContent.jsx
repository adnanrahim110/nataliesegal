"use client";

import Button from "@/components/ui/Button";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function BookContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-b from-neutral-50/60 to-white"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/60 to-transparent" />
      <div className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-200/40 via-transparent to-amber-100/30 rounded-3xl blur-2xl" />
              <div className="relative overflow-hidden shadow-2xl ring-1 ring-black/10">
                <Image
                  src="/imgs/book.png"
                  alt="Heroes of the Middle Ages - Book Cover"
                  width={600}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="space-y-4">
              <SectionSubtitle align="left">Latest Release</SectionSubtitle>
              <SectionTitle
                as="h1"
                size="text-4xl md:text-5xl lg:text-6xl font-noticia tracking-tight"
                className="leading-tight"
              >
                Heroes of the Middle Ages
              </SectionTitle>
            </div>

            <div className="space-y-6 text-neutral-700 text-lg leading-relaxed">
              <p>
                At its heart, Heroes of the Middle Ages is a story about
                rediscovery of truth, faith, and the quiet strength found in the
                ordinary. Set between the streets of Hartford and the shadows of
                ancient magic, the novel follows three women bound by blood and
                mystery as they face powers that challenge everything they
                believe about reality.
              </p>
              <p>
                Rose, Hannah, and Miriam are not knights or warriors, but their
                courage is no less fierce. Each is forced to confront fear,
                guilt, and the ghosts of her own past while learning that
                heroism isn't about saving the world—it's about saving one
                another.
              </p>
              <p>
                Beneath the suspense and supernatural tension lies something
                deeply human: the ache of aging, the search for meaning, and the
                hope that even after loss, life still offers second chances.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                as={Link}
                href="https://amazon.com"
                tone="dark"
                className="px-8 py-3"
                contentClassName="font-serif text-base"
              >
                Order on Amazon
              </Button>
              <Button
                as={Link}
                href="/about"
                tone="light"
                className="px-8 py-3"
                contentClassName="font-serif text-base"
              >
                About the Author
              </Button>
            </div>

            {/* Book Details */}
            <div className="pt-6 border-t border-neutral-200/60">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-neutral-900">Genre</dt>
                  <dd className="text-neutral-600">Historical Fiction</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Language</dt>
                  <dd className="text-neutral-600">English</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
