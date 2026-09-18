import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <p className="page-hero-bg" aria-hidden="true">
        {eyebrow}
      </p>
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      {meta}
      <p className="lede">{description}</p>
    </header>
  );
}
