"use client";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import { FaAmazon } from "react-icons/fa";
import Button from "../ui/Button";
import SectionSubtitle from "../ui/SectionSubtitle";
import SectionTitle from "../ui/SectionTitle";

const Cta = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-[radial-gradient(80%_80%_at_10%_0%,_rgba(134,239,172,0.25),_transparent_60%),radial-gradient(80%_80%_at_100%_100%,_rgba(134,239,172,0.18),_transparent_60%)]"
    >
      <div className="container py-16 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid items-center md:grid-cols-2 gap-10 md:gap-14"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="relative w-full max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[30rem] mx-auto"
          >
            <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-primary-300/50 via-primary-500/30 to-primary-300/20 blur-2xl" />
            <div className="relative">
              <Image
                src="/imgs/book-mockup.png"
                alt="Book cover"
                width={1200}
                height={1600}
                sizes="(min-width: 1024px) 24rem, (min-width: 768px) 22rem, (min-width: 640px) 20rem, 18rem"
                style={{ width: "100%", height: "auto" }}
                className="object-contain"
                priority={false}
              />
            </div>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <div className="space-y-6">
              <SectionSubtitle>Available Now</SectionSubtitle>
              <SectionTitle as="h2" size="section">
                Bring the Book Home
              </SectionTitle>
              <p className="text-neutral-700">
                Thoughtful, warm, and grounded in real life—this book blends
                heartfelt stories with practical tools to help you move through
                change, find your courage, and live with clarity. Get your copy
                on Amazon today.
              </p>
              <div className="pt-2">
                <Button
                  href="https://www.amazon.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                  contentClassName="flex items-center gap-2 text-black"
                  tone="dark"
                >
                  <FaAmazon className="h-5 w-5" />
                  <span>Buy on Amazon</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Cta;
