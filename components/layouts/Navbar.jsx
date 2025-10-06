"use client";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../ui/Button";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <header className={cn("w-full top-0 z-[100] py-2.5")}>
      <div className="container">
        <nav className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image
                src="/imgs/logo-b.png"
                alt="logo"
                width={256}
                height={149}
                className="w-full max-w-32"
              />
            </Link>
          </div>
          <ul className="hidden lg:flex items-center justify-center gap-10">
            {NAV_LINKS.map((navLink, idx) => (
              <li key={idx} className="relative inline-block">
                <Link
                  href={navLink.href}
                  className={cn(
                    "font-noticia relative inline-block",
                    "before:absolute before:bottom-0 before:left-0 before:h-px before:transition-all before:duration-300",
                    pathname === navLink.href
                      ? "text-primary-600 before:w-full before:bg-primary-600"
                      : "text-black before:w-0 hover:before:w-full hover:before:bg-black"
                  )}
                >
                  {navLink.name}
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <Button>Buy Now</Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
