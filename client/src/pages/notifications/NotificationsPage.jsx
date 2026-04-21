import { AlertTriangle, BellRing, CheckCheck } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDateTime } from "../../utils/formatters";

export const NotificationsPage = () => {
  const columns = [
    {
      header: "Bildirim",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.description}</p>
        </div>
      ),
    },
    {
      header: "Oncelik",
      render: (row) => <StatusBadge value={row.severity}>{row.severity}</StatusBadge>,
    },
    {
      header: "Olusma",
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: "Okundu",
      render: (row) => <StatusBadge value={row.read ? "active" : "warning"}>{row.read ? "Evet" : "Hayir"}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Bildirim Merkezi"
      title="Operasyon, risk ve belge uyarilarini tek akista toplayin"
      description="Kritik stok, vade ve onay bekleyen belge uyarilarini duzenli bir merkezden yonetin."
      loader={enterpriseService.listNotifications}
      columns={columns}
      searchPlaceholder="Bildirim basligi veya aciklamasi ile arayin"
      tableTitle="Bildirim Listesi"
      tableDescription="Okunmamis ve kritik uyarilari dogrudan onceliklendirin."
      emptyTitle="Bildirim bulunamadi"
      emptyDescription="Goruntulenecek bildirim bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Okunmamis", value: summary.unreadCount || 0, isCurrency: false, icon: BellRing },
        { title: "Kritik Uyari", value: summary.criticalCount || 0, isCurrency: false, tone: "negative", icon: AlertTriangle },
        { title: "Uyari Seviyesi", value: summary.warningCount || 0, isCurrency: false, icon: CheckCheck },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Bugunun Gundemi"
          description="Takip edilmesi gereken anlik sistem sinyalleri."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{row.title}</p>
                  <StatusBadge value={row.severity}>{row.severity}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">{row.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
