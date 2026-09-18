import Link from "next/link";
import type { Crumb } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="麵包屑">
      <ol>
        {items.map((item, index) => (
          <li key={item.path}>
            {index < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span>{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
