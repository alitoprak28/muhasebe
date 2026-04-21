import { Building2, CreditCard, WalletCards } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const typeOptions = [
  { value: "supplier", label: "Tedarikci" },
  { value: "personnel", label: "Personel" },
  { value: "tax", label: "Vergi" },
];

const statusOptions = [
  { value: "completed", label: "Tamamlandi" },
  { value: "scheduled", label: "Planlandi" },
];

export const PaymentsPage = () => {
  const columns = [
    {
      header: "Odeme",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.paymentNumber}</p>
          <p className="text-xs text-muted">{row.payeeName}</p>
        </div>
      ),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.paymentDate),
    },
    {
      header: "Kategori",
      render: (row) => <StatusBadge value={row.category}>{row.category}</StatusBadge>,
    },
    {
      header: "Yontem",
      render: (row) => row.paymentMethod,
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-danger-500">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Odeme Yonetimi"
      title="Tedarikci, vergi ve personel odemelerini planlayin"
      description="Operasyonel nakit cikislarini kategori ve vade bilinciyle yoneterek finansal kontrolu guclendirin."
      loader={enterpriseService.listPayments}
      columns={columns}
      typeOptions={typeOptions}
      statusOptions={statusOptions}
      searchPlaceholder="Odeme no, alici veya kategori ile arayin"
      tableTitle="Odeme Listesi"
      tableDescription="Tamamlanmis ve planli odeme kayitlarini yonetin."
      emptyTitle="Odeme kaydi bulunamadi"
      emptyDescription="Uygun filtreyle odeme kaydi listelenemedi."
      buildMetrics={({ summary }) => [
        { title: "Toplam Odeme", value: summary.totalAmount || 0, tone: "negative", icon: CreditCard },
        { title: "Planli Tutar", value: summary.scheduledAmount || 0, icon: WalletCards },
        { title: "Tamamlanan Tutar", value: summary.completedAmount || 0, icon: Building2 },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Odeme Takvimi"
          description="Yaklasan cıkislar kasa ve banka planlamasi icin oncelik verir."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{row.paymentNumber}</p>
                  <StatusBadge value={row.status}>{row.status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">{row.payeeName}</p>
                <p className="mt-1 text-sm font-medium text-danger-500">{formatCurrency(row.amount)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
