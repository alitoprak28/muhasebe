import { FileBadge2, FileText, Plus, Send } from "lucide-react";
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
  { value: "sales", label: "Satis Teklifi" },
  { value: "purchase", label: "Alis Teklifi" },
];

const statusOptions = [
  { value: "sent", label: "Gonderildi" },
  { value: "negotiation", label: "Muzakere" },
  { value: "approved", label: "Onaylandi" },
];

export const OffersPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offerFields = [
    { name: "offerNumber", label: "Teklif no", rules: { required: "Teklif numarasi zorunludur." }, placeholder: "TKL-2026-010" },
    { name: "currentName", label: "Cari unvani", rules: { required: "Cari unvani zorunludur." }, placeholder: "Orion Magazacilik A.S." },
    { name: "type", label: "Tip", type: "select", options: typeOptions, defaultValue: "sales" },
    { name: "status", label: "Durum", type: "select", options: statusOptions, defaultValue: "sent" },
    { name: "issueDate", label: "Belge tarihi", type: "date", defaultValue: new Date() },
    { name: "validUntil", label: "Gecerlilik tarihi", type: "date", defaultValue: new Date() },
    { name: "items", label: "Kalem sayisi", type: "number", defaultValue: 1 },
    { name: "subtotal", label: "Ara toplam", type: "number", defaultValue: 0 },
    { name: "discount", label: "Iskonto", type: "number", defaultValue: 0 },
    { name: "vatTotal", label: "KDV toplami", type: "number", defaultValue: 0 },
    { name: "grandTotal", label: "Genel toplam", type: "number", defaultValue: 0 },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createOffer(values));
      toast.success("Yeni teklif olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Teklif olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <>
      <EnterpriseTablePage
      eyebrow="Teklif Yonetimi"
      title="Ticari firsatlari teklif havuzunda yonetin"
      description="Tekliften siparise donusecek satis ve alis dosyalarini durum bazli olarak takip edin."
      loader={enterpriseService.listOffers}
      refreshKey={refreshKey}
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
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Teklif
        </Button>
      }
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
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni teklif"
        description="Teklif akisini baslatacak temel belge bilgisini sisteme kaydedin."
      >
        <EnterpriseRecordForm
          fields={offerFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Teklifi Kaydet"
        />
      </Modal>
    </>
  );
};
