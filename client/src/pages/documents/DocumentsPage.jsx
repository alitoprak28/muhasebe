import { Archive, FileText, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { EnterpriseRecordForm } from "../../components/forms/EnterpriseRecordForm";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDateTime } from "../../utils/formatters";

export const DocumentsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentFields = [
    { name: "name", label: "Dosya adi", rules: { required: "Dosya adi zorunludur." }, placeholder: "irsaliye-arsiv.pdf" },
    {
      name: "type",
      label: "Belge tipi",
      type: "select",
      options: [
        { value: "invoice_pdf", label: "Fatura PDF" },
        { value: "dispatch_pdf", label: "Irsaliye PDF" },
        { value: "payment_receipt", label: "Odeme dekontu" },
      ],
      defaultValue: "invoice_pdf",
    },
    { name: "relatedModule", label: "Ilgili modul", placeholder: "dispatch" },
    { name: "owner", label: "Yukleyen", rules: { required: "Sahip zorunludur." }, placeholder: "Demo Operator" },
    { name: "uploadedAt", label: "Yuklenme tarihi", type: "date", defaultValue: new Date() },
    {
      name: "status",
      label: "Durum",
      type: "select",
      options: [
        { value: "review", label: "Incelemede" },
        { value: "approved", label: "Onayli" },
        { value: "archived", label: "Arsivde" },
      ],
      defaultValue: "review",
    },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createDocument(values));
      toast.success("Yeni dokuman kaydi olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Dokuman olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <>
      <EnterpriseTablePage
      eyebrow="Dokuman Yonetimi"
      title="Belge arsivini denetime hazir sekilde yonetin"
      description="Fatura PDF'leri, irsaliyeler ve dekontlari modullerine bagli olarak arsivleyin."
      loader={enterpriseService.listDocuments}
      refreshKey={refreshKey}
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
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Dokuman
        </Button>
      }
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
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni dokuman"
        description="Arsive veya kontrol akisine girecek yeni belge kaydini olusturun."
      >
        <EnterpriseRecordForm
          fields={documentFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Dokumani Kaydet"
        />
      </Modal>
    </>
  );
};
