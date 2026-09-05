"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [form, setForm] = useState({
    fullName: "",
    phone:    "",
    email:    "",
    password: "",
    confirm:  "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // 1. Create the account
    const res = await fetch("/api/auth/signup", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        fullName: form.fullName,
        phone:    form.phone,
        email:    form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    // 2. Immediately sign them in
    const signInRes = await signIn("credentials", {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      // Account created but sign-in failed — send to login
      router.push("/login");
      return;
    }

    // 3. Redirect to callbackUrl (e.g. /checkout?plan=xxx) or dashboard
    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 mb-10 justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#BFE01D]" />
          <span className="font-display text-[#f2f4e8] tracking-[0.4em] text-base uppercase">
            Iron House
          </span>
        </a>

        <div className="border border-[#BFE01D]/15 bg-[#0d0f08] p-8">
          <h1 className="font-display text-2xl text-[#f2f4e8] uppercase mb-1 tracking-wide">
            Create account
          </h1>
          <p className="text-[#9aa87a] text-xs mb-8">
            Join Iron House — it takes 30 seconds
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name *">
              <input
                type="text"
                required
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Your full name"
                className={cls}
              />
            </Field>

            <Field label="Phone *">
              <input
                type="tel"
                required
                value={form.phone}
                onChange={set("phone")}
                placeholder="+880 1700 000 000"
                className={cls}
              />
            </Field>

            <Field label="Email *">
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className={cls}
              />
            </Field>

            <Field label="Password *">
              <input
                type="password"
                required
                value={form.password}
                onChange={set("password")}
                placeholder="Min 6 characters"
                className={cls}
              />
            </Field>

            <Field label="Confirm Password *">
              <input
                type="password"
                required
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="••••••••"
                className={cls}
              />
            </Field>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BFE01D] text-black text-xs font-bold uppercase tracking-[0.25em] py-4 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account & continue"}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-[#9aa87a] text-xs mt-6">
          Already have an account?{" "}
          <Link
            href={callbackUrl !== "/dashboard" ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
            className="text-[#BFE01D] hover:opacity-80 transition-opacity"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const cls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-3 outline-none focus:border-[#BFE01D] transition-colors";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <SignupForm />
    </Suspense>
  );
}
