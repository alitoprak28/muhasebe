import { ClipboardList, PencilLine, PlusCircle } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDateTime } from "../../utils/formatters";

export const ActivityLogsPage = () => {
  const columns = [
    {
      header: "Islem",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.summary}</p>
          <p className="text-xs text-muted">{row.entityLabel}</p>
        </div>
      ),
    },
    {
      header: "Modul",
      render: (row) => row.module,
    },
    {
      header: "Aksiyon",
      render: (row) => <StatusBadge value={row.action}>{row.action}</StatusBadge>,
    },
    {
      header: "Kullanici",
      render: (row) => row.actor,
    },
    {
      header: "Tarih",
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Islem Loglari"
      title="Kritik hareketleri ve degisiklik izlerini denetleyin"
      description="Olusturma, guncelleme ve yukleme islemlerini kullanici ve zaman bazli olarak geriye donuk izleyin."
      loader={enterpriseService.listActivityLogs}
      columns={columns}
      searchPlaceholder="Kullanici, modul veya belge ile arayin"
      tableTitle="Log Kayitlari"
      tableDescription="Sistem icindeki islemsel izlerin kontrol ve denetimini yapin."
      emptyTitle="Log bulunamadi"
      emptyDescription="Listelenecek log kaydi bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Toplam Log", value: summary.total || 0, isCurrency: false, icon: ClipboardList },
        { title: "Olusturma Islemi", value: summary.createCount || 0, isCurrency: false, icon: PlusCircle },
        { title: "Guncelleme Islemi", value: summary.updateCount || 0, isCurrency: false, icon: PencilLine },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Denetim Olaylari"
          description="Son degisiklikleri akis mantigiyla izleyin."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-semibold text-ink">{row.actor}</p>
                <p className="mt-2 text-sm text-muted">{row.summary}</p>
                <p className="mt-1 text-sm text-muted">{formatDateTime(row.createdAt)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
