"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
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
          <span className="font-display text-white tracking-[0.4em] text-base uppercase">
            Fit Gym Center
          </span>
        </div>

        <div className="border border-[#1a1a1a] bg-[#0b0b0b] p-8">
          <h1 className="font-display text-2xl text-white uppercase mb-1 tracking-wide">
            Sign In
          </h1>
          <p className="text-[#bdbdbd] text-xs mb-8">Staff & admin access</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#bdbdbd] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] text-white text-sm px-4 py-3 outline-none focus:border-[#BFE01D] transition-colors"
                placeholder="owner@fitgymcenter.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#bdbdbd] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-[#1a1a1a] text-white text-sm px-4 py-3 outline-none focus:border-[#BFE01D] transition-colors"
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

        <p className="text-center text-[#1a1a1a] text-[10px] mt-6 tracking-widest uppercase">
          Fit Gym Center Management
        </p>
      </div>
    </div>
  );
}
