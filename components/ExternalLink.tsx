type ExternalLinkProps = {
  href: string;
  children: string;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{children}</span>
      <span className="ext-icon" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
