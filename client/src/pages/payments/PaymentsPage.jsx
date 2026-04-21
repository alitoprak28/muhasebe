import { Building2, CreditCard, Plus, WalletCards } from "lucide-react";
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
  { value: "supplier", label: "Tedarikci" },
  { value: "personnel", label: "Personel" },
  { value: "tax", label: "Vergi" },
];

const statusOptions = [
  { value: "completed", label: "Tamamlandi" },
  { value: "scheduled", label: "Planlandi" },
];

export const PaymentsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentFields = [
    { name: "paymentNumber", label: "Odeme no", rules: { required: "Odeme no zorunludur." }, placeholder: "ODM-2026-010" },
    { name: "payeeName", label: "Odeme alicisi", rules: { required: "Alici zorunludur." }, placeholder: "Orion Tedarik Zinciri Ltd." },
    { name: "paymentDate", label: "Odeme tarihi", type: "date", defaultValue: new Date() },
    { name: "amount", label: "Tutar", type: "number", defaultValue: 0 },
    { name: "category", label: "Kategori", type: "select", options: typeOptions, defaultValue: "supplier" },
    {
      name: "paymentMethod",
      label: "Odeme yontemi",
      type: "select",
      options: [
        { value: "bank_transfer", label: "Banka transferi" },
        { value: "eft", label: "EFT" },
        { value: "cash", label: "Nakit" },
      ],
      defaultValue: "bank_transfer",
    },
    { name: "status", label: "Durum", type: "select", options: statusOptions, defaultValue: "scheduled" },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createPayment(values));
      toast.success("Yeni odeme kaydi olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Odeme kaydi olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <>
      <EnterpriseTablePage
      eyebrow="Odeme Yonetimi"
      title="Tedarikci, vergi ve personel odemelerini planlayin"
      description="Operasyonel nakit cikislarini kategori ve vade bilinciyle yoneterek finansal kontrolu guclendirin."
      loader={enterpriseService.listPayments}
      refreshKey={refreshKey}
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
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Odeme
        </Button>
      }
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
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni odeme"
        description="Tedarikci, vergi veya personel odemesi icin yeni kayit acin."
      >
        <EnterpriseRecordForm
          fields={paymentFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Odemeyi Kaydet"
        />
      </Modal>
    </>
  );
};
