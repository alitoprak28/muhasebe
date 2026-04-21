export const PageHeader = ({ eyebrow, title, description, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
};

