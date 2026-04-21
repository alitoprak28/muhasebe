import { cn } from "../../utils/cn";

export const SectionCard = ({ title, description, action, className, children }) => {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-soft",
        className
      )}
    >
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {title ? <h3 className="font-heading text-xl font-bold text-ink">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};

