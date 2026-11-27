"use client";

import Image from "next/image";
import { useState } from "react";
import { REPLAY_FALLBACK_SRC } from "@/lib/youtube";

export function ReplayThumbnail({
  src,
  alt = "",
  sizes = "(max-width: 860px) 100vw, 50vw",
}: {
  src: string;
  alt?: string;
  sizes?: string;
}) {
  const [current, setCurrent] = useState(src);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => {
        if (current !== REPLAY_FALLBACK_SRC) setCurrent(REPLAY_FALLBACK_SRC);
      }}
    />
  );
}
