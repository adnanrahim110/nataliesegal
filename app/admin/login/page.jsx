"use client";

import PasswordInput from "@/components/ui/PasswordInput";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelopeOpenText,
  FaLock,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSubmitError, setForgotSubmitError] = useState("");
  const [forgotSubmitSuccess, setForgotSubmitSuccess] = useState("");
  const [forgotResetUrl, setForgotResetUrl] = useState("");

  useEffect(() => {
    const savedRemember = localStorage.getItem("adminRemember");
    const savedEmail = localStorage.getItem("adminEmail") || "";
    if (savedRemember != null) {
      const remembered = savedRemember === "true";
      setRemember(remembered);
      if (remembered && savedEmail) {
        setEmail(savedEmail);
      }
    } else if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailTouched(true);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordTouched(true);
    setPasswordError(validatePassword(value));
  };

  const openForgot = () => {
    setForgotOpen(true);
    setForgotEmail(email || "");
    setForgotTouched(false);
    setForgotEmailError("");
    setForgotSubmitError("");
    setForgotSubmitSuccess("");
    setForgotResetUrl("");
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setForgotSubmitting(false);
    setForgotSubmitError("");
  };

  const handleForgotEmailChange = (e) => {
    const value = e.target.value;
    setForgotEmail(value);
    setForgotTouched(true);
    setForgotEmailError(validateEmail(value));
    setForgotSubmitError("");
    setForgotSubmitSuccess("");
    setForgotResetUrl("");
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotTouched(true);
    setForgotSubmitError("");
    setForgotSubmitSuccess("");
    setForgotResetUrl("");

    const validation = validateEmail(forgotEmail);
    setForgotEmailError(validation);
    if (validation) return;

    setForgotSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = {};
      }
      if (!res.ok) {
        throw new Error(data?.error || "Could not send reset link");
      }
      setForgotSubmitSuccess("If that email is registered, a reset link is on its way.");
      if (typeof data?.resetUrl === "string") {
        setForgotResetUrl(data.resetUrl);
      }
    } catch (err) {
      setForgotSubmitError(err.message || "Could not send reset link");
    } finally {
      setForgotSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailTouched(true);
    setPasswordTouched(true);

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    if (emailValidation || passwordValidation) return;

    setLoading(true);
    try {
      localStorage.setItem("adminRemember", String(remember));
      if (remember) {
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("adminEmail");
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      router.replace("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-neutral-950/5">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_50%)]" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <aside className="mx-auto max-w-xl lg:mx-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">
            <FaShieldAlt /> Secure admin access
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Welcome back, admin
          </h1>
          <p className="mt-4 text-base text-neutral-600 sm:text-lg">
            Sign in to manage content, review analytics, and keep your publication running smoothly.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-neutral-600">
            {[
              "Role-based access ensures only authorised changes.",
              "Remember this device for faster access next time.",
              "Enterprise-grade encryption keeps your account safe.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5">
            <div className="border-b border-neutral-200 bg-neutral-50/80 px-6 py-4">
              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  <FaArrowLeft /> Back to site
                </Link>
                <span className="text-xs text-neutral-400">|</span>
                <span>Admin sign-in</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5 px-6 py-8">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailTouched(true)}
                  className={clsx(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm transition-all",
                    "focus:outline-none focus:ring-2",
                    emailError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : emailTouched && email
                      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                      : "border-neutral-200 focus:border-primary-400 focus:ring-primary-100"
                  )}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
                {emailError ? (
                  <p className="text-xs font-medium text-red-600">{emailError}</p>
                ) : emailTouched && email ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <FaCheckCircle /> Looks good
                  </p>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">Password</label>
                <PasswordInput
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="********"
                  inputClassName={clsx(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm transition-all",
                    "focus:outline-none focus:ring-2",
                    passwordError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : passwordTouched && password
                      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                      : "border-neutral-200 focus:border-primary-400 focus:ring-primary-100"
                  )}
                  autoComplete="current-password"
                  required
                />
                {passwordError ? (
                  <p className="text-xs font-medium text-red-600">{passwordError}</p>
                ) : passwordTouched && password ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <FaCheckCircle /> Looks secure
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setRemember(checked);
                      if (!checked) {
                        localStorage.removeItem("adminRemember");
                        localStorage.removeItem("adminEmail");
                      }
                    }}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium text-neutral-600">Remember this device</span>
                </label>
                <button
                  type="button"
                  onClick={openForgot}
                  className="font-medium text-primary-600 transition-colors hover:text-primary-700"
                >
                  Forgot password?
                </button>
              </div>

              {error ? (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Signing in…
                  </>
                ) : (
                  <>
                    <FaLock /> Sign in
                  </>
                )}
              </button>

              <p className="text-center text-xs text-neutral-400">
                Protected area. Unauthorised access is prohibited.
              </p>
            </form>
          </div>
        </main>
      </div>
      {forgotOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeForgot}
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
              aria-label="Close"
              disabled={forgotSubmitting}
            >
              <FaTimes className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <FaEnvelopeOpenText className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-neutral-900">Reset password</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Enter your admin email address and we&apos;ll send you a secure password reset link.
            </p>

            <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Email address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={handleForgotEmailChange}
                  onBlur={() => {
                    setForgotTouched(true);
                    setForgotEmailError(validateEmail(forgotEmail));
                  }}
                  className={clsx(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm transition-all focus:outline-none focus:ring-2",
                    forgotEmailError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : forgotTouched && forgotEmail
                      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                      : "border-neutral-200 focus:border-primary-400 focus:ring-primary-100"
                  )}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={forgotSubmitting}
                  required
                />
                {forgotEmailError ? (
                  <p className="text-xs font-medium text-red-600">{forgotEmailError}</p>
                ) : forgotTouched && forgotEmail ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <FaCheckCircle /> Looks good
                  </p>
                ) : null}
              </div>

              {forgotSubmitError ? (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {forgotSubmitError}
                </div>
              ) : null}

              {forgotSubmitSuccess ? (
                <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <FaCheckCircle className="text-emerald-500" /> {forgotSubmitSuccess}
                  </div>
                  {forgotResetUrl ? (
                    <div className="break-all rounded-lg bg-white/70 px-3 py-2 font-mono text-[11px] text-emerald-700">
                      {forgotResetUrl}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={closeForgot}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:w-auto"
                  disabled={forgotSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {forgotSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaLock /> Send reset link
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

