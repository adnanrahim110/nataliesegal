"use client";
import { cn } from "@/lib/cn";
import { motion } from "motion/react";
import React from "react";

const sizeMap = {
  hero: "text-4xl md:text-5xl lg:text-6xl tracking-tight",
  section: "text-3xl md:text-4xl lg:text-5xl tracking-tight",
  md: "text-2xl md:text-3xl tracking-tight",
};

const SectionTitle = ({
  children,
  as: Tag = "h2",
  size = "section",
  accent = true,
  accentClassName = "bg-primary-500/80",
  underlineWidth = "w-16",
  align = "left",
  fullWidth = false,
  className,
  titleClassName,
}) => {
  const sizeClasses = sizeMap[size] || size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        fullWidth ? "w-full" : "max-w-xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Tag className={cn(sizeClasses, titleClassName)}>{children}</Tag>
      {accent && (
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className={cn(
            "mt-4 block h-1",
            underlineWidth,
            accentClassName,
            align === "center" && "mx-auto"
          )}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
};

export default SectionTitle;
