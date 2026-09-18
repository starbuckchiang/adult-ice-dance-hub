export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-arc" />
      <div className="hero-dot hero-dot-a" />
      <div className="hero-dot hero-dot-b" />
      <article className="hero-info-card">
        <p className="kicker">TONIGHT ON ICE</p>
        <h2>跨國成人冰舞入口</h2>
        <p>官方協會、賽事公告與規則來源，雙人與單人分開標示。</p>
        <div className="badge-row">
          <span className="badge badge-partnered">Partnered Dance</span>
          <span className="badge badge-solo">Solo Dance</span>
        </div>
      </article>
      <div className="hero-mini-stack">
        <span className="hero-mini">USA · United States</span>
        <span className="hero-mini">JPN · Japan</span>
        <span className="hero-mini">CAN · Canada</span>
        <span className="hero-mini">SUI · Switzerland</span>
      </div>
    </div>
  );
}
