"use client";
import { useState } from "react";
import Loader from "./Loader";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  return (
    <>
      {/* Loader sits on top — unmounts itself via phase="gone" */}
      {!done && <Loader onDone={() => setDone(true)} />}

      {/* Page is always in the DOM — the loader overlay covers it */}
      {children}
    </>
  );
}
