"use client";

import Button from "@/components/ui/Button";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "motion/react";
import { FaAmazon, FaQuoteLeft, FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    content:
      "This story hit me harder than I expected. Beneath the vampires and telekinesis, it's really about courage, grief, and finding meaning after loss. Natalie Segal writes with empathy and precision, like she's lived every scene she describes.",
    author: "Noah Steve",
    role: "Student",
    rating: 5,
  },
  {
    id: 2,
    content:
      "I finished Heroes of the Middle Ages weeks ago, but I keep thinking about Rose and Misha. It's more than a story about magic it's about people trying to do good in a world that doesn't make sense. The ending left me full of hope and a little haunted.",
    author: "Stephen Brown",
    role: "Reader",
    rating: 5,
  },
  {
    id: 3,
    content:
      "Natalie Segal writes like someone who's lived a few lives already. This book is wise, funny, and quietly profound. I saw pieces of myself in every flawed, brave, middle-aged hero she created. I'll be reading whatever she writes next.",
    author: "Pauline Austin",
    role: "Author",
    rating: 5,
  },
  {
    id: 4,
    content:
      "Segal builds a world where logic meets faith, and you end up questioning which one you'd choose. Highly recommended!",
    author: "Taylor Neil",
    role: "Writer",
    rating: 5,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-amber-400" : "text-neutral-300"}
          size={16}
        />
      ))}
    </div>
  );
}

export default function ReviewsContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-linear-to-b from-neutral-50/60 to-white"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200/60 to-transparent" />
      <div className="container py-16 md:py-24">
        <div className="space-y-4 text-center mb-16">
          <SectionSubtitle align="center">What Readers Say</SectionSubtitle>
          <SectionTitle
            as="h1"
            size="hero"
            align="center"
            fullWidth
            underlineWidth="w-20 md:w-28"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            Reviews
          </SectionTitle>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover what readers are saying about Heroes of the Middle Ages
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="group relative"
            >
              <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-primary-300/50 via-amber-200/30 to-primary-200/40 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-2xl bg-white/90 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur-sm h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary-100/40 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 ring-1 ring-primary-200/50">
                      <FaQuoteLeft className="text-primary-600 text-xl" />
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={review.rating} />
                      <span className="ml-2 text-sm font-medium text-amber-600">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  <blockquote className="font-noticia text-neutral-800 text-xl leading-relaxed mb-8 italic">
                    "{review.content}"
                  </blockquote>

                  <footer className="relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-300/60 to-transparent" />
                    <div className="pt-6 flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-linear-to-br from-primary-200 to-amber-200 opacity-60" />
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-600 to-primary-700 text-white font-bold text-sm shadow-lg">
                          {review.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-neutral-900 text-lg">
                          {review.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-neutral-200">
                            {review.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl border border-neutral-200/70 bg-white/60 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur max-w-2xl mx-auto">
            <h3 className="font-noticia text-2xl tracking-tight mb-4">
              Join the Conversation
            </h3>
            <p className="text-neutral-600 mb-6">
              Have you read Heroes of the Middle Ages? Share your thoughts and
              join the growing community of readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="https://amazon.com/dp/B0FTTHB1D2"
                target="_blank"
                className="px-6 py-3"
                contentClassName="font-serif flex items-center gap-2"
              >
                <FaAmazon />
                Leave a Review
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
