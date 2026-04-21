import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RotateCcw, Search } from "lucide-react";
import { reportService } from "../../services/reportService";
import { currentService } from "../../services/currentService";
import { accountService } from "../../services/accountService";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { DataTable } from "../../components/common/DataTable";
import { FieldGroup, Input, Select } from "../../components/common/FormControls";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

const initialFilterState = {
  startDate: "",
  endDate: "",
};

export const ReportsPage = () => {
  const [filters, setFilters] = useState(initialFilterState);
  const [draftFilters, setDraftFilters] = useState(initialFilterState);
  const [overview, setOverview] = useState(null);
  const [dailyIncome, setDailyIncome] = useState([]);
  const [monthlyFinancials, setMonthlyFinancials] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [currents, setCurrents] = useState([]);
  const [cashAccounts, setCashAccounts] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedCurrentId, setSelectedCurrentId] = useState("");
  const [selectedCashId, setSelectedCashId] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [currentReport, setCurrentReport] = useState(null);
  const [cashReport, setCashReport] = useState(null);
  const [bankReport, setBankReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadCoreData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const [
        overviewResponse,
        dailyIncomeResponse,
        monthlyResponse,
        expenseResponse,
        currentsResponse,
        cashResponse,
        bankResponse,
      ] = await Promise.all([
        reportService.overview(filters),
        reportService.dailyIncome(filters),
        reportService.monthlyFinancials(filters),
        reportService.expenseCategories(filters),
        currentService.list({ limit: 100 }),
        accountService.listCash({ limit: 100 }),
        accountService.listBanks({ limit: 100 }),
      ]);

      setOverview(overviewResponse.data);
      setDailyIncome(dailyIncomeResponse.data);
      setMonthlyFinancials(monthlyResponse.data);
      setExpenseCategories(expenseResponse.data);
      setCurrents(currentsResponse.data);
      setCashAccounts(cashResponse.data);
      setBankAccounts(bankResponse.data);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoreData();
  }, [filters]);

  useEffect(() => {
    const fetchCurrentReport = async () => {
      if (!selectedCurrentId) {
        setCurrentReport(null);
        return;
      }

      const response = await reportService.currentStatement(selectedCurrentId, filters);
      setCurrentReport(response.data);
    };

    fetchCurrentReport().catch(() => setCurrentReport(null));
  }, [filters, selectedCurrentId]);

  useEffect(() => {
    const fetchCashReport = async () => {
      if (!selectedCashId) {
        setCashReport(null);
        return;
      }

      const response = await reportService.cashMovements(selectedCashId, filters);
      setCashReport(response.data);
    };

    fetchCashReport().catch(() => setCashReport(null));
  }, [filters, selectedCashId]);

  useEffect(() => {
    const fetchBankReport = async () => {
      if (!selectedBankId) {
        setBankReport(null);
        return;
      }

      const response = await reportService.bankMovements(selectedBankId, filters);
      setBankReport(response.data);
    };

    fetchBankReport().catch(() => setBankReport(null));
  }, [filters, selectedBankId]);

  if (isLoading) {
    return <LoadingState label="Raporlar hazirlaniyor..." />;
  }

  if (hasError || !overview) {
    return (
      <ErrorState
        title="Raporlama modulu yuklenemedi"
        description="Rapor servislerinden biri yanit vermedi. Sunucuyu kontrol ederek tekrar deneyebilirsiniz."
        onRetry={loadCoreData}
      />
    );
  }

  const movementColumns = [
    {
      header: "Aciklama",
      render: (row) => row.title || row.note || row.type,
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Yon",
      render: (row) => (
        <StatusBadge value={row.direction}>{row.direction === "credit" || row.direction === "in" ? "Alacak" : "Borc"}</StatusBadge>
      ),
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-ink">{formatCurrency(row.amount)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Raporlama"
        title="Finansal resmi farkli acilardan okuyun"
        description="Gunluk gelir, aylik performans, kategori raporlari ve hesap hareketleri tek ekranda birlesir."
      />

      <SectionCard title="Donem Filtreleri" description="Tum rapor kartlarini secili tarih araligina gore guncelleyin.">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_auto_auto]">
          <FieldGroup label="Baslangic">
            <Input
              type="date"
              value={draftFilters.startDate}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Bitis">
            <Input
              type="date"
              value={draftFilters.endDate}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </FieldGroup>
          <div className="flex items-end">
            <Button className="w-full" icon={Search} onClick={() => setFilters(draftFilters)}>
              Uygula
            </Button>
          </div>
          <div className="flex items-end">
            <Button
              className="w-full"
              variant="ghost"
              icon={RotateCcw}
              onClick={() => {
                setDraftFilters(initialFilterState);
                setFilters(initialFilterState);
              }}
            >
              Sifirla
            </Button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-5">
        <MetricCard title="Toplam Gelir" value={overview.cards.totalIncome} />
        <MetricCard title="Toplam Gider" value={overview.cards.totalExpense} tone="negative" />
        <MetricCard title="Net Sonuc" value={overview.cards.netResult} tone={overview.cards.netResult >= 0 ? "positive" : "negative"} />
        <MetricCard title="Bekleyen Alacak" value={overview.cards.outstandingReceivables} />
        <MetricCard title="Fatura Toplami" value={overview.cards.totalInvoiced} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Gunluk Gelir Raporu" description="Gun bazinda gelir yogunlugunu gorun.">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyIncome}>
                <CartesianGrid stroke="#e6ecf5" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}K`} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="total" fill="#0b69db" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Aylik Kar-Zarar Ritimleri" description="Aylik bazda net sonucu okuyun.">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinancials}>
                <CartesianGrid stroke="#e6ecf5" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}K`} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="income" fill="#2fa26f" radius={[10, 10, 0, 0]} />
                <Bar dataKey="expense" fill="#f97316" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Kategori Bazli Gider Raporu" description="Harcama kompozisyonunu kategori bazinda inceleyin.">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseCategories} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid stroke="#e6ecf5" horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `${Math.round(value / 1000)}K`} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} width={120} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="total" fill="#143c73" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Cari Hesap Ekstresi" description="Secili cari icin hareket gecmisi ve bakiye.">
          <FieldGroup label="Cari secimi">
            <Select value={selectedCurrentId} onChange={(event) => setSelectedCurrentId(event.target.value)}>
              <option value="">Cari seciniz</option>
              {currents.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <div className="mt-5">
            <DataTable
              columns={movementColumns}
              data={currentReport?.movements || []}
              emptyTitle="Cari raporu secilmedi"
              emptyDescription="Bir cari secerek ekstre raporunu goruntuleyin."
            />
          </div>
        </SectionCard>

        <SectionCard title="Kasa Hareket Raporu" description="Secili kasanin para giris-cikislarina odaklanin.">
          <FieldGroup label="Kasa secimi">
            <Select value={selectedCashId} onChange={(event) => setSelectedCashId(event.target.value)}>
              <option value="">Kasa seciniz</option>
              {cashAccounts.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <div className="mt-5">
            <DataTable
              columns={movementColumns}
              data={cashReport?.movements || []}
              emptyTitle="Kasa raporu secilmedi"
              emptyDescription="Bir kasa secerek hareket raporunu inceleyin."
            />
          </div>
        </SectionCard>

        <SectionCard title="Banka Hareket Raporu" description="Secili banka hesabi icin hareket dokumu.">
          <FieldGroup label="Banka secimi">
            <Select value={selectedBankId} onChange={(event) => setSelectedBankId(event.target.value)}>
              <option value="">Banka hesabi seciniz</option>
              {bankAccounts.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.bankName} / {item.accountName}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <div className="mt-5">
            <DataTable
              columns={movementColumns}
              data={bankReport?.movements || []}
              emptyTitle="Banka raporu secilmedi"
              emptyDescription="Bir banka hesabi secerek hareket raporunu inceleyin."
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

