export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-shape" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
