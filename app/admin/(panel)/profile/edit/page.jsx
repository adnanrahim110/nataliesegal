"use client";

import Dropzone from "@/components/ui/Dropzone";
import PasswordInput from "@/components/ui/PasswordInput";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaInfoCircle,
  FaLock,
  FaSave,
  FaUserCircle,
} from "react-icons/fa";

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

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        } else if (res.status === 401) {
          router.replace("/admin/login");
        }
      } catch {}
    })();
  }, [router]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const submitProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback(null);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");

      let nextAvatar = user?.avatar_url || null;
      if (avatarFile) {
        const fd = new FormData();
        fd.append("file", avatarFile);
        const up = await fetch("/api/admin/me/avatar", {
          method: "POST",
          body: fd,
        });
        const uj = await up.json().catch(() => ({}));
        if (!up.ok) throw new Error(uj?.error || "Failed to upload avatar");
        nextAvatar = uj?.url || nextAvatar;
      }

      const updatedUser = {
        ...(user || {}),
        name,
        email,
        avatar_url: nextAvatar,
      };
      setUser(updatedUser);
      setAvatarFile(null);
      setAvatarPreview(null);
      setDropzoneKey((key) => key + 1);
      setProfileFeedback({ type: "success", text: "Profile updated" });
      try {
        window.dispatchEvent(
          new CustomEvent("admin:user-updated", {
            detail: { user: updatedUser },
          })
        );
      } catch {}
    } catch (err) {
      setProfileFeedback({
        type: "error",
        text: (err && err.message) || "Failed to update profile",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }
    setSavingPass(true);
    try {
      const res = await fetch("/api/admin/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to change password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordFeedback({ type: "success", text: "Password updated" });
    } catch (err) {
      setPasswordFeedback({
        type: "error",
        text: (err && err.message) || "Failed to change password",
      });
    } finally {
      setSavingPass(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-500"></span>
          Loading profile…
        </div>
      </div>
    );
  }

  const initials = getInitials(user.name);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-inner">
              <FaUserCircle className="text-xl" />
            </span>
            <div>
              <h1 className="font-noticia text-3xl tracking-tight text-neutral-900">
                Edit profile
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Update your public details and keep your account secure.
              </p>
            </div>
          </div>
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <FaArrowLeft /> Back to profile
          </Link>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <header className="mb-6 space-y-1">
            <h2 className="text-lg font-semibold text-neutral-900">
              Profile details
            </h2>
            <p className="text-sm text-neutral-500">
              This information appears in author attributions across published
              posts.
            </p>
          </header>

          <form onSubmit={submitProfile} className="space-y-5">
            <div className="grid lg:grid-cols-[auto_1fr] gap-4 lg:gap-y-1">
              <div className="relative flex h-full aspect-square items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-inner">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt={name || "Avatar preview"}
                    fill
                    className="object-cover"
                  />
                ) : user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={name || "Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-neutral-500">
                    {initials}
                  </span>
                )}
              </div>
              <div>
                <Dropzone key={dropzoneKey} onFile={setAvatarFile} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <FaEnvelope />
                  </span>
                  <input
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pl-9 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {profileFeedback && (
              <div
                className={classNames(
                  "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                  profileFeedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-600"
                )}
              >
                <FaInfoCircle />
                <span>{profileFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={savingProfile || !name || !email}
              className="inline-flex items-center gap-3 rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingProfile ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save profile
                </>
              )}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <header className="mb-6 space-y-1">
              <h2 className="text-lg font-semibold text-neutral-900">
                Change password
              </h2>
              <p className="text-sm text-neutral-500">
                Choose a strong password you haven't used elsewhere.
              </p>
            </header>

            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Current password
                </label>
                <PasswordInput
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    New password
                  </label>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Confirm new password
                  </label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {passwordFeedback && (
                <div
                  className={classNames(
                    "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                    passwordFeedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  )}
                >
                  <FaInfoCircle />
                  <span>{passwordFeedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={savingPass}
                className="inline-flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPass ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-600"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaLock /> Change password
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-800">
              Security guidance
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>• Use a unique password for this admin area.</li>
              <li>
                • Update your password every few months or after device changes.
              </li>
              <li>
                • Contact support immediately if you notice suspicious activity.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
