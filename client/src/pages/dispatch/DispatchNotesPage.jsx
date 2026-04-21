import { ClipboardCheck, PackageOpen, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { EnterpriseRecordForm } from "../../components/forms/EnterpriseRecordForm";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatchFields = [
    { name: "noteNumber", label: "Irsaliye no", rules: { required: "Irsaliye numarasi zorunludur." }, placeholder: "IRS-2026-010" },
    { name: "type", label: "Tip", type: "select", options: typeOptions, defaultValue: "sales_dispatch" },
    { name: "currentName", label: "Cari unvani", rules: { required: "Cari unvani zorunludur." }, placeholder: "Orion Magazacilik A.S." },
    { name: "dispatchDate", label: "Sevk tarihi", type: "date", defaultValue: new Date() },
    { name: "deliveredTo", label: "Teslim alan", placeholder: "Depo Kabul" },
    { name: "vehiclePlate", label: "Arac / plaka", placeholder: "35 ABC 101" },
    { name: "warehouseName", label: "Depo adi", placeholder: "Ege Sevkiyat Deposu" },
    { name: "sourceOrder", label: "Bagli siparis", placeholder: "SPS-2026-010" },
    { name: "status", label: "Durum", type: "select", options: statusOptions, defaultValue: "partial" },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createDispatchNote(values));
      toast.success("Yeni irsaliye olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Irsaliye olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <>
      <EnterpriseTablePage
      eyebrow="Irsaliye Yonetimi"
      title="Sevk ve kabul belgelerini operasyon ritminde izleyin"
      description="Kismi sevk, teslim alma ve faturaya donusum asamalarini tek panelden takip edin."
      loader={enterpriseService.listDispatchNotes}
      refreshKey={refreshKey}
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
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Irsaliye
        </Button>
      }
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
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni irsaliye"
        description="Sevk veya kabul akisina baglanacak irsaliye kaydini olusturun."
      >
        <EnterpriseRecordForm
          fields={dispatchFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Irsaliyeyi Kaydet"
        />
      </Modal>
    </>
  );
};
