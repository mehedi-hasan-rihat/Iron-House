"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect:    false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#BFE01D]" />
          <span className="font-display text-[#f2f4e8] tracking-[0.4em] text-base uppercase">
            Fit Gym Center
          </span>
        </div>

        <div className="border border-[#BFE01D]/15 bg-[#0d0f08] p-8">
          <h1 className="font-display text-2xl text-[#f2f4e8] uppercase mb-1 tracking-wide">
            Sign In
          </h1>
          <p className="text-[#9aa87a] text-xs mb-8">Staff & admin access</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-3 outline-none focus:border-[#BFE01D] transition-colors"
                placeholder="owner@fitgymcenter.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-3 outline-none focus:border-[#BFE01D] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BFE01D] text-black text-xs font-bold uppercase tracking-[0.25em] py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#1f2408] text-[10px] mt-6 tracking-widest uppercase">
          Fit Gym Center Management
        </p>
      </div>
    </div>
  );
}

/* useSearchParams opts the subtree into client-side rendering, so the form has
   to sit behind a Suspense boundary or the page can't be prerendered at all. */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <LoginForm />
    </Suspense>
  );
}
