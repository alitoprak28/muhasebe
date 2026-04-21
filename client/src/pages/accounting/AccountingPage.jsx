import { BookText, Landmark, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/common/DataTable";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AccountingPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    </div>
  );
};
