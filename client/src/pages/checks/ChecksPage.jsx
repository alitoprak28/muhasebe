import { AlertTriangle, FileCheck2, Landmark } from "lucide-react";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
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
    <EnterpriseTablePage
      eyebrow="Cek / Senet"
      title="Kiymetli evrak riskini ve vade yapisini yonetin"
      description="Portfoydeki cek ve senetleri vade, banka ve karsi taraf bilgisiyle profesyonelce takip edin."
      loader={enterpriseService.listChecks}
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
  );
};
