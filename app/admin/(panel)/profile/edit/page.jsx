"use client";

import Dropzone from "@/components/ui/Dropzone";
import PasswordInput from "@/components/ui/PasswordInput";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaSave,
  FaUserCircle,
} from "react-icons/fa";

const CODE_LENGTH = 6;
const CODE_EXPIRY_MS = 2 * 60 * 1000;
const RESEND_DELAY_MS = 15 * 1000;

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
  const [originalEmail, setOriginalEmail] = useState("");
  const [verificationMeta, setVerificationMeta] = useState({
    requested: false,
    verified: false,
    expiresAt: null,
  });
  const [sendingVerification, setSendingVerification] = useState(false);
  const [showVerificationBox, setShowVerificationBox] = useState(false);
  const [codeDigits, setCodeDigits] = useState(Array(CODE_LENGTH).fill(""));
  const codeInputsRef = useRef([]);
  const [lastCodeSentAt, setLastCodeSentAt] = useState(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [timerTick, setTimerTick] = useState(Date.now());

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setOriginalEmail(data.user.email || "");
          setVerificationMeta({
            requested: false,
            verified: false,
            expiresAt: null,
          });
          setShowVerificationBox(false);
          setCodeDigits(Array(CODE_LENGTH).fill(""));
          setLastCodeSentAt(null);
          setCodeExpiresAt(null);
          setVerifyingEmail(false);
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

  const emailChanged =
    email.trim().toLowerCase() !== (originalEmail || "").toLowerCase();

  useEffect(() => {
    if (!emailChanged) {
      setShowVerificationBox(false);
      setVerificationMeta({
        requested: false,
        verified: false,
        expiresAt: null,
      });
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setLastCodeSentAt(null);
      setCodeExpiresAt(null);
      setVerifyingEmail(false);
    }
  }, [emailChanged]);

  useEffect(() => {
    if (!codeExpiresAt || !verificationMeta.requested) return;
    const interval = setInterval(() => {
      setTimerTick(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [codeExpiresAt, verificationMeta.requested]);

  const finalizeProfileUpdate = useCallback(async () => {
    if (!user) return;
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail }),
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
        name: cleanName,
        email: cleanEmail,
        avatar_url: nextAvatar,
      };
      setUser(updatedUser);
      setOriginalEmail(cleanEmail);
      setAvatarFile(null);
      setAvatarPreview(null);
      setDropzoneKey((key) => key + 1);
      setVerificationMeta({
        requested: false,
        verified: false,
        expiresAt: null,
      });
      setShowVerificationBox(false);
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setLastCodeSentAt(null);
      setCodeExpiresAt(null);
      try {
        window.dispatchEvent(
          new CustomEvent("admin:user-updated", {
            detail: { user: updatedUser },
          })
        );
      } catch {}
      toast.success("Profile updated");
      router.push("/admin/profile");
    } catch (err) {
      toast.error((err && err.message) || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }, [avatarFile, email, name, router, user]);

  const submitProfile = async (e) => {
    e.preventDefault();
    const codeIsExpired =
      verificationMeta.requested && codeExpiresAt && Date.now() > codeExpiresAt;

    if (emailChanged && !verificationMeta.verified) {
      setShowVerificationBox(true);
      if (
        (!verificationMeta.requested || codeIsExpired) &&
        !sendingVerification
      ) {
        await requestEmailVerification();
      }
      toast.success("Enter the verification code sent to your current email.");
      return;
    }
    await finalizeProfileUpdate();
  };
  const submitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
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
      toast.success("Password updated");
      router.push("/admin/profile");
    } catch (err) {
      toast.error((err && err.message) || "Failed to change password");
    } finally {
      setSavingPass(false);
    }
  };

  const requestEmailVerification = useCallback(async () => {
    if (!emailChanged) {
      toast.error("Update the email before requesting verification.");
      return;
    }
    if (sendingVerification) return;
    setShowVerificationBox(true);
    setSendingVerification(true);
    try {
      const res = await fetch("/api/admin/me/request-email-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Failed to send verification");
      const sentAt = Date.now();
      const expiresMs = data?.expiresAt
        ? new Date(data.expiresAt).getTime()
        : sentAt + CODE_EXPIRY_MS;
      setVerificationMeta({
        requested: true,
        verified: false,
        expiresAt: data?.expiresAt || new Date(expiresMs).toISOString(),
      });
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setLastCodeSentAt(sentAt);
      setCodeExpiresAt(expiresMs);
      setTimerTick(Date.now());
      toast.success("Verification code sent to your current email.");
      if (data?.devCode) {
        console.info("[Email change verification code]", data.devCode);
      }
      setTimeout(() => {
        codeInputsRef.current?.[0]?.focus();
      }, 50);
    } catch (err) {
      toast.error(err?.message || "Failed to send verification");
    } finally {
      setSendingVerification(false);
    }
  }, [emailChanged, email, sendingVerification]);

  const verifyCode = useCallback(
    async (codeString) => {
      if (verifyingEmail) return;
      setVerifyingEmail(true);
      try {
        const res = await fetch("/api/admin/me/confirm-email-change", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeString }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Failed to verify email change");
        setVerificationMeta({
          requested: false,
          verified: true,
          expiresAt: null,
        });
        setCodeDigits(Array(CODE_LENGTH).fill(""));
        setLastCodeSentAt(null);
        setCodeExpiresAt(null);
        await finalizeProfileUpdate();
      } catch (err) {
        toast.error(err?.message || "Failed to verify email change");
        setCodeDigits(Array(CODE_LENGTH).fill(""));
        setTimeout(() => {
          codeInputsRef.current?.[0]?.focus();
        }, 80);
      } finally {
        setVerifyingEmail(false);
      }
    },
    [finalizeProfileUpdate, verifyingEmail]
  );

  const focusCodeInput = (index) => {
    const el = codeInputsRef.current?.[index];
    if (el) {
      el.focus();
      el.select?.();
    }
  };

  const handleCodeInputChange = (index, rawValue) => {
    if (verificationMeta.verified) return;
    const value = rawValue.replace(/\D/g, "");
    const nextDigit = value ? value.slice(-1) : "";
    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = nextDigit;
      return next;
    });
    if (nextDigit && index < CODE_LENGTH - 1) {
      focusCodeInput(index + 1);
    }
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      setCodeDigits((prev) => {
        const next = [...prev];
        if (next[index]) {
          next[index] = "";
        } else if (index > 0) {
          next[index - 1] = "";
          focusCodeInput(index - 1);
        }
        return next;
      });
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusCodeInput(index - 1);
    } else if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      focusCodeInput(index + 1);
    }
  };

  const handleCodePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const digits = pasted.slice(0, CODE_LENGTH).split("");
    setCodeDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < CODE_LENGTH; i += 1) {
        next[i] = digits[i] || "";
      }
      return next;
    });
    const focusIndex = Math.min(digits.length, CODE_LENGTH) - 1;
    if (focusIndex >= 0) {
      focusCodeInput(focusIndex);
    }
  };

  useEffect(() => {
    if (!verificationMeta.requested || verificationMeta.verified) return;
    if (verifyingEmail) return;
    if (codeDigits.some((digit) => digit.length === 0)) return;
    if (codeExpiresAt && Date.now() > codeExpiresAt) return;
    verifyCode(codeDigits.join(""));
  }, [
    codeDigits,
    codeExpiresAt,
    verificationMeta.requested,
    verificationMeta.verified,
    verifyCode,
    verifyingEmail,
  ]);

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
  const now = timerTick;
  const remainingMs = codeExpiresAt ? Math.max(0, codeExpiresAt - now) : 0;
  const timerSeconds = codeExpiresAt ? Math.ceil(remainingMs / 1000) : 0;
  const timerLabel = codeExpiresAt
    ? `${String(Math.floor(timerSeconds / 60)).padStart(1, "0")}:${String(
        timerSeconds % 60
      ).padStart(2, "0")}`
    : "00:00";
  const timerProgress = codeExpiresAt
    ? Math.min(1, Math.max(0, remainingMs / CODE_EXPIRY_MS))
    : 0;
  const timerStyle = {
    background: `conic-gradient(#339674 ${timerProgress * 360}deg, #e5e9f2 ${
      timerProgress * 360
    }deg 360deg)`,
  };
  const resendReadyMs = lastCodeSentAt
    ? RESEND_DELAY_MS - (now - lastCodeSentAt)
    : 0;
  const resendDisabled =
    sendingVerification ||
    verifyingEmail ||
    !lastCodeSentAt ||
    resendReadyMs > 0;
  const resendCountdown =
    resendDisabled && lastCodeSentAt
      ? Math.ceil(Math.max(0, resendReadyMs) / 1000)
      : 0;
  const codeExpired =
    verificationMeta.requested && codeExpiresAt && remainingMs <= 0;

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
                {showVerificationBox ? (
                  <div className="mt-3 space-y-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-4 text-sm text-primary-700">
                    <div className="space-y-2">
                      <p>
                        We'll confirm this change via{" "}
                        <span className="font-semibold">{originalEmail}</span>{" "}
                        before it takes effect.
                      </p>
                      {!verificationMeta.requested ? (
                        <button
                          type="button"
                          onClick={requestEmailVerification}
                          disabled={sendingVerification}
                          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {sendingVerification
                            ? "Sending..."
                            : "Send verification code"}
                        </button>
                      ) : (
                        <p className="text-xs text-primary-600">
                          {codeExpired
                            ? "The previous code expired. Request a new one."
                            : "Enter the 6-digit code we sent to your current email."}
                        </p>
                      )}
                    </div>
                    {verificationMeta.requested ? (
                      <div className="relative rounded-xl border border-primary-200 bg-white/80 p-4 shadow-sm">
                        {verifyingEmail && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
                            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500"></span>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="relative h-12 w-12">
                              <div
                                className="absolute inset-0 rounded-full border border-primary-100"
                                style={timerStyle}
                              />
                              <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white text-xs font-semibold text-primary-600">
                                {timerLabel}
                              </div>
                            </div>
                            <div
                              className="flex items-center gap-[5px]"
                              onPaste={handleCodePaste}
                            >
                              {codeDigits.map((digit, idx) => (
                                <input
                                  key={idx}
                                  ref={(el) =>
                                    (codeInputsRef.current[idx] = el)
                                  }
                                  value={digit}
                                  onChange={(e) =>
                                    handleCodeInputChange(idx, e.target.value)
                                  }
                                  onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                                  className="h-10 w-7 rounded-lg border border-primary-200 bg-white text-center text-lg font-semibold text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
                                  inputMode="numeric"
                                  maxLength={1}
                                  disabled={codeExpired || verifyingEmail}
                                  placeholder="-"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-neutral-500">
                            {codeExpired
                              ? "Code expired."
                              : `Code expires in ${Math.round(
                                  CODE_EXPIRY_MS / 60000
                                )} minutes.`}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={requestEmailVerification}
                            disabled={resendDisabled}
                            className="inline-flex items-center rounded-lg border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-sm transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {resendDisabled
                              ? `Resend code in ${Math.max(
                                  resendCountdown,
                                  0
                                )}s`
                              : "Resend code"}
                          </button>
                          {resendDisabled && resendCountdown > 0 ? (
                            <span className="text-xs text-neutral-500">
                              Please wait before requesting another code.
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
            <button
              type="submit"
              disabled={savingProfile || verifyingEmail || !name || !email}
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
