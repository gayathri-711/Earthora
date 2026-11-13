export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center max-w-3xl' : 'max-w-3xl';
  return (
    <div className={alignment}>
      {eyebrow && (
        <span className="mb-2.5 inline-block text-xs sm:text-sm font-black uppercase tracking-[0.22em] text-earthora-olive bg-earthora-sand/40 px-3.5 py-1 rounded-full border border-earthora-sand/80 shadow-xs">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-earthora-forest leading-[1.12]">
        {title}
      </h2>
      {subtitle && <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-earthora-muted">{subtitle}</p>}
    </div>
  );
}
