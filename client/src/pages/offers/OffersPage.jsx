import { FileBadge2, FileText, Send } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const typeOptions = [
  { value: "sales", label: "Satis Teklifi" },
  { value: "purchase", label: "Alis Teklifi" },
];

const statusOptions = [
  { value: "sent", label: "Gonderildi" },
  { value: "negotiation", label: "Muzakere" },
  { value: "approved", label: "Onaylandi" },
];

export const OffersPage = () => {
  const columns = [
    {
      header: "Teklif",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.offerNumber}</p>
          <p className="text-xs text-muted">{row.currentName}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type === "sales" ? "Satis" : "Alis"}</StatusBadge>,
    },
    {
      header: "Belge Tarihi",
      render: (row) => formatDate(row.issueDate),
    },
    {
      header: "Gecerlilik",
      render: (row) => formatDate(row.validUntil),
    },
    {
      header: "Kalem",
      render: (row) => row.items,
    },
    {
      header: "Toplam",
      render: (row) => <span className="font-semibold text-brand-700">{formatCurrency(row.grandTotal)}</span>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Teklif Yonetimi"
      title="Ticari firsatlari teklif havuzunda yonetin"
      description="Tekliften siparise donusecek satis ve alis dosyalarini durum bazli olarak takip edin."
      loader={enterpriseService.listOffers}
      columns={columns}
      typeOptions={typeOptions}
      statusOptions={statusOptions}
      searchPlaceholder="Teklif no veya cari unvani ile arayin"
      tableTitle="Teklif Listesi"
      tableDescription="Acik teklifleri, onaylananlari ve muzakeredeki belgeleri tek tabloda izleyin."
      emptyTitle="Teklif bulunamadi"
      emptyDescription="Filtreleri genisleterek farkli teklifleri goruntuleyebilirsiniz."
      buildMetrics={({ summary }) => [
        { title: "Toplam Teklif Tutarı", value: summary.totalAmount || 0, icon: FileText },
        { title: "Gonderilen Teklif", value: summary.sent || 0, isCurrency: false, icon: Send },
        { title: "Onaylanan Teklif", value: summary.approved || 0, isCurrency: false, icon: FileBadge2 },
      ]}
      renderSideContent={({ rows, summary }) => (
        <>
          <SectionCard title="Teklif Ozetleri" description="Pipeline'in bugunku dagilimi.">
            <div className="space-y-3">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm text-muted">Toplam Teklif Hacmi</p>
                <p className="mt-2 font-heading text-2xl font-extrabold text-ink">
                  {formatCurrency(summary.totalAmount || 0)}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-muted">
                Muzakeredeki dosyalar, satis ekibi ile operasyon arasindaki donusum potansiyelini gosterir.
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Dikkat Gerektirenler" description="Yakinda sona erecek teklif pencereleri.">
            <div className="space-y-3">
              {rows.slice(0, 3).map((row) => (
                <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                  <p className="font-semibold text-ink">{row.offerNumber}</p>
                  <p className="mt-2 text-sm text-muted">{row.currentName}</p>
                  <p className="mt-1 text-sm text-muted">Son tarih: {formatDate(row.validUntil)}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    />
  );
};
