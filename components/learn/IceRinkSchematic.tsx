export function IceRinkSchematic({ label }: { label: string }) {
  return (
    <figure className="rink-schematic">
      <svg viewBox="0 0 320 180" role="img" aria-label={label}>
        <rect x="8" y="8" width="304" height="164" rx="72" fill="#1c1533" stroke="#d9ff43" strokeWidth="3" />
        <line x1="160" y1="18" x2="160" y2="162" stroke="rgba(247,243,236,0.28)" strokeWidth="2" />
        <line x1="28" y1="90" x2="292" y2="90" stroke="rgba(247,243,236,0.18)" strokeWidth="2" />
        <path
          d="M70 90 C90 40, 140 40, 160 90 C180 140, 230 140, 250 90"
          fill="none"
          stroke="#7047eb"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="70" cy="90" r="5" fill="#d9ff43" />
        <text x="160" y="28" textAnchor="middle" fill="#bbb1ca" fontSize="11">
          長軸
        </text>
        <text x="40" y="86" fill="#bbb1ca" fontSize="11">
          短軸
        </text>
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
