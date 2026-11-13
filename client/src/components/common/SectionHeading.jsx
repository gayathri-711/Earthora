export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center max-w-2xl' : 'max-w-2xl';
  return (
    <div className={alignment}>
      {eyebrow && (
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.16em] text-agriva-pine">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-agriva-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-agriva-muted">{subtitle}</p>}
    </div>
  );
}

