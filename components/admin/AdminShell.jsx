"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaFeather,
  FaRegNewspaper,
  FaSignOutAlt,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: FaChartPie },
  { href: "/admin/add-blog", label: "Create Post", icon: FaFeather },
  { href: "/admin/blogs", label: "Posts", icon: FaRegNewspaper },
  { href: "/admin/profile", label: "Profile", icon: FaUserCircle },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${
    parts[parts.length - 1][0] || ""
  }`.toUpperCase();
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch {}
  }, []);

  useEffect(() => {
    loadUser();

    const handleUpdate = (event) => {
      const next = event?.detail?.user;
      if (next) setUser(next);
      else loadUser();
    };

    window.addEventListener("admin:user-updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("admin:user-updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [loadUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.replace("/admin/login");
  };

  const initials = getInitials(user?.name || "Admin");

  const renderNavLink = (item) => {
    const Icon = item.icon;
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={classNames(
          "group relative flex items-center rounded-2xl text-sm font-medium transition-all duration-200",
          collapsed ? "justify-center gap-0 p-2 w-fit" : "gap-3 p-3 w-full",
          active
            ? "bg-primary-50 text-primary-700 shadow-sm"
            : "text-neutral-500 hover:bg-neutral-100/70 hover:text-neutral-800"
        )}
      >
        <span
          className={classNames(
            "flex items-center justify-center rounded-xl border transition-colors",
            collapsed ? "h-10 w-10" : "h-11 w-11",
            active
              ? "border-primary-200 bg-white text-primary-600"
              : "border-neutral-200 bg-white text-neutral-500 group-hover:border-neutral-300 group-hover:text-neutral-700"
          )}
        >
          <Icon className="text-lg" />
        </span>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-neutral-800">
              {item.label}
            </span>
            <span className="text-xs text-neutral-500">
              {item.label === "Dashboard"
                ? "Overview"
                : item.label === "Create Post"
                ? "Compose"
                : item.label === "Posts"
                ? "Library"
                : "Account"}
            </span>
          </div>
        )}
        {collapsed && (
          <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-lg md:group-hover:block">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen w-full bg-neutral-50">
      <div
        className={classNames(
          "fixed inset-0 z-30 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-neutral-200 bg-white/90 px-4 pb-5 pt-6 shadow-neutral-900/10 transition-transform duration-300",
          collapsed ? "md:w-20 md:px-2" : "md:w-72 md:px-6",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div
          className={classNames(
            "transition-all duration-200 border",
            collapsed
              ? "px-1 py-2 rounded-xl w-fit border-transparent"
              : "border-neutral-200 bg-white/80 text-center shadow-sm rounded-3xl px-4 py-6 w-full"
          )}
        >
          <Image
            src={
              collapsed ? "/web-app-manifest-512x512.png" : "/imgs/logo-b.png"
            }
            alt="logo"
            width={160}
            height={160}
            className={classNames(
              "mx-auto inline-block transition-all duration-200",
              collapsed ? "md:w-12" : "md:w-32"
            )}
          />
          {!collapsed && (
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-sm font-semibold text-primary-600">
                Admin Panel
              </p>
              <p className="text-xs text-neutral-500">Content suite</p>
            </div>
          )}
        </div>

        <nav
          className={classNames(
            "custom-scrollbar mt-6 flex-1 space-y-1 overflow-y-auto overflow-x-hidden",
            collapsed ? "pr-0" : "pr-1"
          )}
        >
          {NAV_LINKS.map(renderNavLink)}
        </nav>

        <div className="mt-6 border-t border-neutral-200 pt-4 w-full">
          <button
            type="button"
            onClick={logout}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 w-full",
              collapsed ? "py-3" : "py-2"
            )}
          >
            <FaSignOutAlt />{" "}
            <span className={cn(collapsed && "hidden")}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={classNames(
          "flex h-full flex-1 min-w-0 flex-col bg-neutral-50 transition-[margin] duration-300",
          collapsed ? "md:ml-20" : "md:ml-72"
        )}
      >
        <header className="sticky top-0 z-30 flex py-2 items-center justify-between border-b border-neutral-200 bg-white/85 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <FaBars />
            </button>
            <button
              type="button"
              className="hidden items-center justify-center rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:bg-neutral-100 md:inline-flex"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
            <div className="hidden flex-col md:flex">
              <span className="text-xs font medium uppercase tracking-[0.3em] text-neutral-400">
                Admin
              </span>
              <span className="text-sm font-semibold text-neutral-700">
                {NAV_LINKS.find((item) => item.href === pathname)?.label ||
                  "Panel"}
              </span>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100"
            >
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || "Avatar"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">{initials}</span>
                )}
              </span>
              <div className="hidden flex-col text-left sm:flex">
                <span className="text-sm font-semibold text-neutral-800">
                  {user?.name || "Admin"}
                </span>
                <span className="text-xs text-neutral-500">{user?.email}</span>
              </div>
              <FaChevronLeft
                className={classNames(
                  "text-xs text-neutral-400 transition-transform",
                  menuOpen ? "rotate-90" : "-rotate-90"
                )}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl"
                >
                  <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-4">
                    <p className="text-sm font-semibold text-neutral-800">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUserCircle className="text-base" /> View profile
                    </Link>
                    <Link
                      href="/admin/profile/edit"
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUserEdit className="text-base" /> Edit profile
                    </Link>
                  </div>
                  <div className="border-t border-neutral-200 p-3">
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-4 pb-10 pt-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
