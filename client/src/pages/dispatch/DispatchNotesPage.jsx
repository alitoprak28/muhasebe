import { ClipboardCheck, PackageOpen, Truck } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDate } from "../../utils/formatters";

const typeOptions = [
  { value: "sales_dispatch", label: "Satis Irsaliyesi" },
  { value: "purchase_dispatch", label: "Alis Irsaliyesi" },
  { value: "shipment", label: "Sevk Irsaliyesi" },
];

const statusOptions = [
  { value: "partial", label: "Kismi" },
  { value: "received", label: "Teslim Alindi" },
  { value: "waiting_invoice", label: "Fatura Bekliyor" },
];

export const DispatchNotesPage = () => {
  const columns = [
    {
      header: "Irsaliye",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.noteNumber}</p>
          <p className="text-xs text-muted">{row.currentName}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Sevk Tarihi",
      render: (row) => formatDate(row.dispatchDate),
    },
    {
      header: "Teslim Alan",
      render: (row) => row.deliveredTo,
    },
    {
      header: "Depo",
      render: (row) => row.warehouseName,
    },
    {
      header: "Arac",
      render: (row) => row.vehiclePlate,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <EnterpriseTablePage
      eyebrow="Irsaliye Yonetimi"
      title="Sevk ve kabul belgelerini operasyon ritminde izleyin"
      description="Kismi sevk, teslim alma ve faturaya donusum asamalarini tek panelden takip edin."
      loader={enterpriseService.listDispatchNotes}
      columns={columns}
      typeOptions={typeOptions}
      statusOptions={statusOptions}
      searchPlaceholder="Irsaliye no, siparis no veya cari ile arayin"
      tableTitle="Irsaliye Listesi"
      tableDescription="Satis, alis ve sevk irsaliyelerini operasyonel statuleriyle goruntuleyin."
      emptyTitle="Irsaliye bulunamadi"
      emptyDescription="Kayitli irsaliye bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Toplam Irsaliye", value: summary.total || 0, isCurrency: false, icon: PackageOpen },
        { title: "Kismi Sevk", value: summary.partialCount || 0, isCurrency: false, icon: Truck },
        { title: "Fatura Bekleyen", value: summary.waitingInvoice || 0, isCurrency: false, icon: ClipboardCheck },
      ]}
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Lojistik Nabzi"
          description="Teslimat zincirindeki son belgeler ve bekleyen faturalar."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{row.noteNumber}</p>
                  <StatusBadge value={row.status}>{row.status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">{row.currentName}</p>
                <p className="mt-1 text-sm text-muted">{row.warehouseName}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    />
  );
};
