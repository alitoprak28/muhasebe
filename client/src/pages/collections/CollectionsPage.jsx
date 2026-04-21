import { CircleDollarSign, HandCoins, Plus, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { EnterpriseRecordForm } from "../../components/forms/EnterpriseRecordForm";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collectionFields = [
    { name: "collectionNumber", label: "Tahsilat no", rules: { required: "Tahsilat no zorunludur." }, placeholder: "TSL-2026-010" },
    { name: "currentName", label: "Cari unvani", rules: { required: "Cari unvani zorunludur." }, placeholder: "Orion Magazacilik A.S." },
    { name: "collectionDate", label: "Tahsilat tarihi", type: "date", defaultValue: new Date() },
    { name: "amount", label: "Tutar", type: "number", defaultValue: 0 },
    { name: "type", label: "Tip", type: "select", options: typeOptions, defaultValue: "invoice_based" },
    {
      name: "paymentMethod",
      label: "Odeme yontemi",
      type: "select",
      options: [
        { value: "bank_transfer", label: "Banka transferi" },
        { value: "credit_card", label: "Kredi karti" },
        { value: "cash", label: "Nakit" },
      ],
      defaultValue: "bank_transfer",
    },
    { name: "invoiceNumber", label: "Fatura no", placeholder: "FTR-2026-010" },
    { name: "status", label: "Durum", type: "select", options: statusOptions, defaultValue: "completed" },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createCollection(values));
      toast.success("Yeni tahsilat kaydi olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Tahsilat kaydi olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <>
      <EnterpriseTablePage
      eyebrow="Tahsilat Yonetimi"
      title="Acik hesaplari ve fatura bazli tahsilatlari kapatin"
      description="Kismi ve tamamlanmis tahsilatlari odeme kanali bazinda izleyerek nakit akisina dogrudan hakim olun."
      loader={enterpriseService.listCollections}
      refreshKey={refreshKey}
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
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Tahsilat
        </Button>
      }
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
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni tahsilat"
        description="Cari veya fatura bazli tahsilat kaydini olusturun."
      >
        <EnterpriseRecordForm
          fields={collectionFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Tahsilati Kaydet"
        />
      </Modal>
    </>
  );
};
