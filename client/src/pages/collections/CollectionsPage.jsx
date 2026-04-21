import { CircleDollarSign, HandCoins, Receipt } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const typeOptions = [
  { value: "invoice_based", label: "Fatura Bazli" },
  { value: "current_account", label: "Cari Hesap" },
];

const statusOptions = [
  { value: "completed", label: "Tamamlandi" },
  { value: "partial", label: "Kismi" },
];

export const CollectionsPage = () => {
  const columns = [
    {
      header: "Tahsilat",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.collectionNumber}</p>
          <p className="text-xs text-muted">{row.currentName}</p>
        </div>
      ),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.collectionDate),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Odeme Yontemi",
      render: (row) => row.paymentMethod,
    },
    {
      header: "Belge",
      render: (row) => row.invoiceNumber || "-",
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-accent-600">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Tahsilat Yonetimi"
      title="Acik hesaplari ve fatura bazli tahsilatlari kapatin"
      description="Kismi ve tamamlanmis tahsilatlari odeme kanali bazinda izleyerek nakit akisina dogrudan hakim olun."
      loader={enterpriseService.listCollections}
      columns={columns}
      typeOptions={typeOptions}
      statusOptions={statusOptions}
      searchPlaceholder="Tahsilat no, cari veya belge no ile arayin"
      tableTitle="Tahsilat Kayitlari"
      tableDescription="Fatura bazli ve cari hesap tahsilatlarini tek akista goruntuleyin."
      emptyTitle="Tahsilat bulunamadi"
      emptyDescription="Filtrelenmis kayit bulunamadi."
      buildMetrics={({ summary }) => [
        { title: "Toplam Tahsilat", value: summary.totalAmount || 0, icon: CircleDollarSign },
        { title: "Tamamlanan Tutar", value: summary.completedAmount || 0, icon: HandCoins },
        { title: "Kismi Kayit", value: summary.partialCount || 0, isCurrency: false, icon: Receipt },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Tahsilat Performansi"
          description="Tamamlama ritmi ve acik tahsilat baskisini gosteren son hareketler."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-semibold text-ink">{row.currentName}</p>
                <p className="mt-2 text-sm text-muted">{row.collectionNumber}</p>
                <p className="mt-1 text-sm font-medium text-brand-700">{formatCurrency(row.amount)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
