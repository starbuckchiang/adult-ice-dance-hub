"use client";

import Image from "next/image";
import { useState } from "react";
import { REPLAY_FALLBACK_SRC } from "@/lib/youtube";

export function ReplayThumbnail({ src, alt = "" }: { src: string; alt?: string }) {
  const [current, setCurrent] = useState(src);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes="(max-width: 860px) 100vw, 50vw"
      onError={() => {
        if (current !== REPLAY_FALLBACK_SRC) setCurrent(REPLAY_FALLBACK_SRC);
      }}
    />
  );
}
