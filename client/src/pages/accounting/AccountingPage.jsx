import { BookText, Landmark, Plus, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { Modal } from "../../components/common/Modal";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { EnterpriseRecordForm } from "../../components/forms/EnterpriseRecordForm";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AccountingPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await Promise.resolve(enterpriseService.getAccountingOverview());
      setData(response);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setFormMode(null);

  const accountFields = [
    { name: "code", label: "Hesap kodu", rules: { required: "Hesap kodu zorunludur." }, placeholder: "153" },
    { name: "name", label: "Hesap adi", rules: { required: "Hesap adi zorunludur." }, placeholder: "Ticari Mallar" },
    {
      name: "type",
      label: "Hesap tipi",
      type: "select",
      options: [
        { value: "asset", label: "Varlik" },
        { value: "liability", label: "Yukumluluk" },
        { value: "income", label: "Gelir" },
        { value: "expense", label: "Gider" },
      ],
      defaultValue: "asset",
    },
    { name: "level", label: "Seviye", type: "number", defaultValue: 1 },
    { name: "balance", label: "Bakiye", type: "number", defaultValue: 0 },
  ];

  const journalFields = [
    { name: "voucherNo", label: "Fis no", rules: { required: "Fis numarasi zorunludur." }, placeholder: "MHS-2026-010" },
    {
      name: "voucherType",
      label: "Fis tipi",
      type: "select",
      options: [
        { value: "mahsup", label: "Mahsup" },
        { value: "tahsil", label: "Tahsil" },
        { value: "tediye", label: "Tediye" },
      ],
      defaultValue: "mahsup",
    },
    { name: "entryDate", label: "Fis tarihi", type: "date", defaultValue: new Date() },
    { name: "description", label: "Aciklama", className: "md:col-span-2", placeholder: "Belge aciklamasi" },
    { name: "sourceDocument", label: "Kaynak belge", placeholder: "FTR-2026-010" },
    { name: "debit", label: "Borc", type: "number", defaultValue: 0 },
    { name: "credit", label: "Alacak", type: "number", defaultValue: 0 },
    {
      name: "status",
      label: "Durum",
      type: "select",
      options: [{ value: "posted", label: "Kaydedildi" }],
      defaultValue: "posted",
    },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);

      if (formMode === "account") {
        await Promise.resolve(enterpriseService.createAccountingAccount(values));
        toast.success("Yeni muhasebe hesabi olusturuldu.");
      }

      if (formMode === "journal") {
        await Promise.resolve(enterpriseService.createJournalEntry(values));
        toast.success("Yeni muhasebe fisi olusturuldu.");
      }

      closeModal();
      await loadData();
    } catch (error) {
      toast.error("Kayit olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingState label="Genel muhasebe gorunumu yukleniyor..." />;
  }

  if (hasError || !data) {
    return (
      <ErrorState
        title="Genel muhasebe ekrani acilamadi"
        description="Hesap planı veya fiş verileri okunamadi."
        onRetry={loadData}
      />
    );
  }

  const accountColumns = [
    {
      header: "Hesap",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.code}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Seviye",
      render: (row) => row.level,
    },
    {
      header: "Bakiye",
      render: (row) => <span className="font-semibold text-brand-700">{formatCurrency(row.balance)}</span>,
    },
  ];

  const journalColumns = [
    {
      header: "Fis",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.voucherNo}</p>
          <p className="text-xs text-muted">{row.description}</p>
        </div>
      ),
    },
    {
      header: "Tur",
      render: (row) => <StatusBadge value={row.voucherType}>{row.voucherType}</StatusBadge>,
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.entryDate),
    },
    {
      header: "Belge",
      render: (row) => row.sourceDocument,
    },
    {
      header: "Borc",
      render: (row) => formatCurrency(row.debit),
    },
    {
      header: "Alacak",
      render: (row) => formatCurrency(row.credit),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Genel Muhasebe"
        title="Hesap plani ve fis akisini mali disiplinle yonetin"
        description="Yevmiye fisleri, hesap planı ve belge baglantilarini tek finans omurgasi icinde birlestirin."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" icon={Plus} onClick={() => setFormMode("account")}>
              Yeni Hesap
            </Button>
            <Button variant="secondary" icon={Plus} onClick={() => setFormMode("journal")}>
              Yeni Fis
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Toplam Borc" value={data.metrics.totalDebit} icon={Scale} />
        <MetricCard title="Toplam Alacak" value={data.metrics.totalCredit} icon={Landmark} />
        <MetricCard title="Hesap Sayisi" value={data.metrics.accountCount} isCurrency={false} icon={BookText} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <SectionCard
          title="Hesap Plani"
          description="Temel bilanço ve gelir tablosu hesaplarini bakiye seviyeleriyle izleyin."
        >
          <DataTable
            columns={accountColumns}
            data={data.accounts}
            emptyTitle="Hesap bulunamadi"
            emptyDescription="Hesap planinda kayit bulunmuyor."
          />
        </SectionCard>

        <SectionCard
          title="Yevmiye Fisleri"
          description="Belgeye bagli muhasebe kayıtlarini fis bazinda goruntuleyin."
        >
          <DataTable
            columns={journalColumns}
            data={data.journalEntries}
            emptyTitle="Fis bulunamadi"
            emptyDescription="Listelenecek muhasebe fişi bulunmuyor."
          />
        </SectionCard>
      </div>

      <Modal
        open={Boolean(formMode)}
        onClose={closeModal}
        title={formMode === "account" ? "Yeni muhasebe hesabi" : "Yeni muhasebe fisi"}
        description="Genel muhasebe omurgasina yeni hesap veya yevmiye fis kaydi ekleyin."
      >
        <EnterpriseRecordForm
          fields={formMode === "account" ? accountFields : journalFields}
          onSubmit={handleCreate}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
          submitLabel={formMode === "account" ? "Hesabi Kaydet" : "Fisi Kaydet"}
        />
      </Modal>
    </div>
  );
};
