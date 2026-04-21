import { CalendarClock, CalendarDays, Landmark } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDate } from "../../utils/formatters";

export const CalendarPage = () => {
  const columns = [
    {
      header: "Takvim Kaydi",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.owner}</p>
        </div>
      ),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Takvim ve Hatirlatmalar"
      title="Vade, vergi ve tahsilat takvimini planli sekilde yonetin"
      description="Yaklasan finansal tarihler ve operasyonel hatirlatmalarin tamamini tek timeline icinde toplayin."
      loader={enterpriseService.listCalendarEvents}
      columns={columns}
      searchPlaceholder="Etkinlik basligi, sorumlu ekip veya tip ile arayin"
      tableTitle="Takvim Kayitlari"
      tableDescription="Yaklasan odeme, tahsilat ve vergi takvimi olaylarini izleyin."
      emptyTitle="Takvim kaydi bulunamadi"
      emptyDescription="Planlanmis kayit bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Toplam Etkinlik", value: summary.total || 0, isCurrency: false, icon: CalendarDays },
        { title: "Yaklasan Kayit", value: summary.upcoming || 0, isCurrency: false, icon: CalendarClock },
        { title: "Vergi Hatirlatmasi", value: summary.taxEvents || 0, isCurrency: false, icon: Landmark },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Yaklasan Tarihler"
          description="Bu hafta icinde aksiyon gerektiren kayitlar."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-semibold text-ink">{row.title}</p>
                <p className="mt-2 text-sm text-muted">{row.owner}</p>
                <p className="mt-1 text-sm text-muted">{formatDate(row.date)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
