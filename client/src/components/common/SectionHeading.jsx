export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center max-w-2xl' : 'max-w-2xl';
  return (
    <div className={alignment}>
      {eyebrow && (
        <span className="mb-2 inline-block text-[11px] font-extrabold uppercase tracking-[0.2em] text-earthora-olive">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-earthora-forest sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-earthora-muted">{subtitle}</p>}
    </div>
  );
}
