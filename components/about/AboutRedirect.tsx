"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DELAY_MS = 6000;

export function AboutRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/");
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
