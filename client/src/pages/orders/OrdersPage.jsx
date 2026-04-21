import { BadgeCheck, ShoppingCart, Truck } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const typeOptions = [
  { value: "sales", label: "Satis Siparisi" },
  { value: "purchase", label: "Alis Siparisi" },
];

const statusOptions = [
  { value: "partial_dispatch", label: "Kismi Sevk" },
  { value: "approved", label: "Onayli" },
  { value: "waiting_dispatch", label: "Sevk Bekliyor" },
];

export const OrdersPage = () => {
  const columns = [
    {
      header: "Siparis",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.orderNumber}</p>
          <p className="text-xs text-muted">{row.currentName}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type === "sales" ? "Satis" : "Alis"}</StatusBadge>,
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.issueDate),
    },
    {
      header: "Teslim",
      render: (row) => formatDate(row.deliveryDate),
    },
    {
      header: "Kaynak",
      render: (row) => row.sourceOffer,
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-brand-700">{formatCurrency(row.total)}</span>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Siparis Yonetimi"
      title="Satis ve alis siparislerini sevk akisina baglayin"
      description="Tekliften donusen siparisleri teslim tarihi ve sevk durumuyla birlikte operasyonel olarak yonetin."
      loader={enterpriseService.listOrders}
      columns={columns}
      typeOptions={typeOptions}
      statusOptions={statusOptions}
      searchPlaceholder="Siparis no, teklif no veya cari ile arayin"
      tableTitle="Siparis Listesi"
      tableDescription="Onayli, kismi sevk edilen ve sevk bekleyen siparisleri izleyin."
      emptyTitle="Siparis bulunamadi"
      emptyDescription="Filtre sonucu siparis kaydi bulunamadi."
      buildMetrics={({ summary }) => [
        { title: "Toplam Siparis Hacmi", value: summary.totalAmount || 0, icon: ShoppingCart },
        { title: "Satis Siparisi", value: summary.salesCount || 0, isCurrency: false, icon: BadgeCheck },
        { title: "Alis Siparisi", value: summary.purchaseCount || 0, isCurrency: false, icon: Truck },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Akis Durumu"
          description="Sevk ve faturalama once acik siparislerdeki birikimi gosterir."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{row.orderNumber}</p>
                  <StatusBadge value={row.status}>{row.status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">{row.currentName}</p>
                <p className="mt-1 text-sm text-muted">Teslim tarihi: {formatDate(row.deliveryDate)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
