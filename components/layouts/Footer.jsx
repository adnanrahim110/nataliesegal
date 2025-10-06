"use client";
import { NAV_LINKS } from "@/constants";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const socials = [
  {
    name: "Twitter",
    href: "#",
    Icon: FaTwitter,
    hover:
      "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10",
  },
  {
    name: "Instagram",
    href: "#",
    Icon: FaInstagram,
    hover:
      "hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10",
  },
  {
    name: "LinkedIn",
    href: "#",
    Icon: FaLinkedin,
    hover:
      "hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10",
  },
  {
    name: "YouTube",
    href: "#",
    Icon: FaYoutube,
    hover:
      "hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-neutral-950 text-neutral-300"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />

      <div className="container pt-10 pb-5 md:pt-12">
        <div className="relative rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md shadow-2xl p-8 md:p-10">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-tr from-primary-500/10 via-transparent to-primary-300/10 blur-xl" />
          <div className="relative grid gap-10 md:gap-14 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <Link
                href="/"
                className="inline-block hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/imgs/logo-w.png"
                  alt="Natalie Segal logo"
                  width={180}
                  height={100}
                  className="w-full max-w-40"
                />
              </Link>
              <p className="text-sm text-neutral-400 max-w-md">
                Author, speaker, and coach sharing stories and tools to help you
                live with courage and clarity.
                <br />
                Honest, warm, and grounded guidance for meaningful change.
              </p>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-white text-base mb-4 relative after:block after:mt-2 after:h-0.5 after:w-10 after:bg-primary-400/80">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="relative inline-block text-sm text-neutral-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 before:absolute before:left-0 before:-bottom-0.5 before:h-px before:w-0 before:bg-white/50 before:transition-all hover:before:w-full"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-white text-base mb-4 relative after:block after:mt-2 after:h-0.5 after:w-10 after:bg-primary-400/80">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <a
                    href="mailto:segalnataliedee@gmail.com"
                    className="group inline-flex items-center gap-2 relative hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <FaEnvelope className="h-4 w-4 text-neutral-500 group-hover:text-white" />
                    <span className="relative before:absolute before:left-0 before:-bottom-0.5 before:h-px before:w-0 before:bg-white/50 before:transition-all group-hover:before:w-full">
                      segalnataliedee@gmail.com
                    </span>
                  </a>
                </li>
                <li className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-neutral-500" />
                  <span>West Hartford, Connecticut</span>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-3">
                {socials.map(({ name, href, Icon, hover }, idx) => (
                  <Link
                    key={idx}
                    href={href}
                    aria-label={name}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition will-change-transform hover:scale-110 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${hover}`}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-neutral-500 flex flex-wrap items-center justify-center md:justify-between gap-4">
          <p>© {year} Natalie Segal. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
