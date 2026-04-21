export const LoadingState = ({ label = "Veriler yukleniyor..." }) => {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[28px] border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-muted">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
        <span>{label}</span>
      </div>
    </div>
  );
};

