"use client";
import { cn } from "@/lib/cn";
import { motion } from "motion/react";
import React from "react";

const SectionSubtitle = ({ children, align = "left", className }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary-300/60 bg-white/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary-700 backdrop-blur",
        align === "center" && "mx-auto",
        className
      )}
    >
      {children}
    </motion.span>
  );
};

export default SectionSubtitle;
