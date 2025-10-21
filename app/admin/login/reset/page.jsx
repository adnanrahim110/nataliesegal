"use client";

import PasswordInput from "@/components/ui/PasswordInput";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaLock } from "react-icons/fa";

const MIN_PASSWORD_LENGTH = 8;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => (searchParams?.get("token") || "").trim(), [searchParams]);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        setError("Reset link is missing or invalid.");
        return;
      }
      try {
        setStatus("loading");
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!res.ok || !data?.valid) {
          setStatus("invalid");
          setError(data?.error || "Reset link is invalid or has expired.");
          return;
        }
        setStatus("ready");
      } catch (err) {
        setStatus("invalid");
        setError("We couldn’t verify this link. Please try again later.");
      }
    };
    verifyToken();
  }, [token]);

  const canSubmit =
    status === "ready" &&
    !submitting &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to reset password.");
      }
      setShowSuccess(true);
      setStatus("success");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
          <p className="text-sm">Checking your reset link…</p>
        </div>
      );
    }

    if (status === "success" && showSuccess) {
      return (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <FaCheckCircle className="text-2xl" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Password updated</h2>
            <p className="text-sm text-neutral-600">
              Your password has been reset successfully. You can now sign in with your new credentials.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <FaLock /> Back to login
          </Link>
        </div>
      );
    }

    if (status === "invalid") {
      return (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Reset link unavailable</h2>
            <p className="text-sm text-neutral-600">{error || "This reset link is invalid or has expired. Please request a new one."}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <FaArrowLeft /> Back to login
            </Link>
            <a
              href="#request"
              onClick={(e) => {
                e.preventDefault();
                router.replace("/admin/login");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
            >
              Request new link
            </a>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">
            New password
          </label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            required
            inputClassName="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          <p className="text-xs text-neutral-500">
            Must be at least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">
            Confirm password
          </label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            inputClassName="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          {confirmPassword && confirmPassword !== password ? (
            <p className="text-xs font-medium text-red-600">Passwords do not match.</p>
          ) : null}
        </div>

        {error && status !== "invalid" ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
            <FaExclamationTriangle /> {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Updating…
            </>
          ) : (
            <>
              <FaLock /> Reset password
            </>
          )}
        </button>
      </form>
    );
  };

  return (
    <div className="relative flex min-h-screen bg-neutral-950/5">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_50%)]" />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-16">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:bg-neutral-100"
        >
          <FaArrowLeft /> Back to sign in
        </Link>

        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-900/5">
          {renderBody()}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center bg-neutral-950/5">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

