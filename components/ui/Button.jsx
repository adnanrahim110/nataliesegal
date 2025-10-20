"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";

const Button = ({
  children,
  href,
  onClick,
  type,
  disabled,
  className,
  target,
  tone = "light",
  contentClassName,
}) => {
  const Tag = href ? Link : "button";

  return (
    <Tag
      {...(href ? { href, target } : { onClick, type, disabled })}
      className={cn(
        "cursor-pointer font-semibold overflow-hidden relative z-100 border group px-8 py-2",
        tone === "dark" ? "border-black" : "border-primary-500",
        className
      )}
    >
      <span
        className={cn(
          "relative z-10 font-noticia group-hover:text-white duration-500",
          tone === "dark" ? "text-black" : "text-primary-600",
          contentClassName
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "absolute w-full h-full -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500",
          tone === "dark" ? "bg-black" : "bg-primary-500"
        )}
      ></span>
      <span
        className={cn(
          "absolute w-full h-full -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500",
          tone === "dark" ? "bg-black" : "bg-primary-500"
        )}
      ></span>
    </Tag>
  );
};

export default Button;
