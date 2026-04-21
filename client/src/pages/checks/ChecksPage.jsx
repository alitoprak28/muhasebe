import { AlertTriangle, FileCheck2, Landmark, Plus } from "lucide-react";
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
  { value: "received_check", label: "Alinan Cek" },
  { value: "issued_check", label: "Verilen Cek" },
  { value: "received_note", label: "Alinan Senet" },
];

const statusOptions = [
  { value: "portfolio", label: "Portfoy" },
  { value: "waiting", label: "Bekliyor" },
  { value: "approaching_due", label: "Vade Yaklasiyor" },
];

export const ChecksPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkFields = [
    { name: "documentNumber", label: "Evrak no", rules: { required: "Evrak numarasi zorunludur." }, placeholder: "CHK-2026-010" },
    { name: "type", label: "Tip", type: "select", options: typeOptions, defaultValue: "received_check" },
    { name: "counterparty", label: "Karsi taraf", rules: { required: "Karsi taraf zorunludur." }, placeholder: "Orion Magazacilik A.S." },
    { name: "bankName", label: "Banka", placeholder: "Yapi Kredi" },
    { name: "issueDate", label: "Duzenleme tarihi", type: "date", defaultValue: new Date() },
    { name: "dueDate", label: "Vade tarihi", type: "date", defaultValue: new Date() },
    { name: "amount", label: "Tutar", type: "number", defaultValue: 0 },
    { name: "status", label: "Durum", type: "select", options: statusOptions, defaultValue: "portfolio" },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createCheck(values));
      toast.success("Yeni cek / senet kaydi olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Cek / senet kaydi olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Evrak",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.documentNumber}</p>
          <p className="text-xs text-muted">{row.counterparty}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Banka",
      render: (row) => row.bankName,
    },
    {
      header: "Duzenleme",
      render: (row) => formatDate(row.issueDate),
    },
    {
      header: "Vade",
      render: (row) => formatDate(row.dueDate),
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-brand-700">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <>
      <EnterpriseTablePage
      eyebrow="Cek / Senet"
      title="Kiymetli evrak riskini ve vade yapisini yonetin"
      description="Portfoydeki cek ve senetleri vade, banka ve karsi taraf bilgisiyle profesyonelce takip edin."
      loader={enterpriseService.listChecks}
      refreshKey={refreshKey}
      columns={columns}
      typeOptions={typeOptions}
      statusOptions={statusOptions}
      searchPlaceholder="Evrak no, banka veya karsi taraf ile arayin"
      tableTitle="Kiymetli Evrak Listesi"
      tableDescription="Alinan ve verilen cek/senet kayitlarini tek bakista goruntuleyin."
      emptyTitle="Cek veya senet bulunamadi"
      emptyDescription="Listelenecek evrak bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Portfoy Tutari", value: summary.portfolioAmount || 0, icon: Landmark },
        { title: "Vadesi Yaklasan", value: summary.approachingDue || 0, isCurrency: false, icon: AlertTriangle },
        { title: "Alinan Evrak", value: summary.receivedCount || 0, isCurrency: false, icon: FileCheck2 },
      ]}
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Cek / Senet
        </Button>
      }
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Vade Izleme"
          description="Yaklasan vade baskisi olan evraklari onceleyin."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-semibold text-ink">{row.documentNumber}</p>
                <p className="mt-2 text-sm text-muted">{row.counterparty}</p>
                <p className="mt-1 text-sm text-muted">Vade: {formatDate(row.dueDate)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      />
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni cek / senet"
        description="Kiymetli evrak portfoyune yeni kayit ekleyin."
      >
        <EnterpriseRecordForm
          fields={checkFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Kaydi Olustur"
        />
      </Modal>
    </>
  );
};
