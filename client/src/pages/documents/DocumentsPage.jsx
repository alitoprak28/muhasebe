import { Archive, FileText, ShieldCheck } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDateTime } from "../../utils/formatters";

export const DocumentsPage = () => {
  const columns = [
    {
      header: "Dokuman",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.relatedModule}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Sahip",
      render: (row) => row.owner,
    },
    {
      header: "Yuklenme",
      render: (row) => formatDateTime(row.uploadedAt),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Dokuman Yonetimi"
      title="Belge arsivini denetime hazir sekilde yonetin"
      description="Fatura PDF'leri, irsaliyeler ve dekontlari modullerine bagli olarak arsivleyin."
      loader={enterpriseService.listDocuments}
      columns={columns}
      searchPlaceholder="Dosya adi, sahip veya modulle arayin"
      tableTitle="Dokuman Listesi"
      tableDescription="Yuklenen dosyalarin onay ve arsiv durumlarini izleyin."
      emptyTitle="Dokuman bulunamadi"
      emptyDescription="Belge arsivinde kayit bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Toplam Dokuman", value: summary.total || 0, isCurrency: false, icon: FileText },
        { title: "Inceleme Bekleyen", value: summary.reviewCount || 0, isCurrency: false, icon: ShieldCheck },
        { title: "Arsivlenen", value: summary.archivedCount || 0, isCurrency: false, icon: Archive },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Belge Kontrolu"
          description="Onay veya saklama aksiyonu gereken son dokumanlar."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{row.name}</p>
                  <StatusBadge value={row.status}>{row.status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">{row.owner}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
