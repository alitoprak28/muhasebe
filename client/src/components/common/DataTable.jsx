import { EmptyState } from "./EmptyState";

export const DataTable = ({
  columns,
  data,
  emptyTitle = "Kayit bulunamadi",
  emptyDescription = "Bu filtrelere uygun veri bulunmuyor.",
}) => {
  if (!data?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key || column.header}
                className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id || row.id} className="rounded-2xl bg-slate-50">
              {columns.map((column) => (
                <td key={column.key || column.header} className="px-3 py-4 text-sm text-ink">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

