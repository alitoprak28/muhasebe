import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Boxes,
  BriefcaseBusiness,
  CircleDollarSign,
  CreditCard,
  FolderOpen,
  Landmark,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardService } from "../../services/dashboardService";
import { enterpriseService } from "../../services/enterpriseService";
import { DataTable } from "../../components/common/DataTable";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

const pieColors = ["#0b69db", "#2fa26f", "#f97316", "#7c3aed", "#e11d48", "#14b8a6"];

const tooltipFormatter = (value) => formatCurrency(value);

const quickActions = [
  {
    title: "Yeni gelir ekle",
    description: "Tahsil edilen satis veya hizmet kaydini sisteme isleyin.",
    to: "/incomes",
    icon: CircleDollarSign,
  },
  {
    title: "Cari ekstre kontrolu",
    description: "Musteri ve tedarikcilerin bakiye durumunu aninda gozden gecirin.",
    to: "/currents",
    icon: BriefcaseBusiness,
  },
  {
    title: "Fatura akisini yonet",
    description: "Bekleyen ve kismi tahsil edilen faturalari kapatin.",
    to: "/invoices",
    icon: ReceiptText,
  },
];

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await dashboardService.getOverview();
      setData(response.data);
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
    return <LoadingState label="Dashboard verileri yukleniyor..." />;
  }

  if (hasError || !data) {
    return (
      <ErrorState
        title="Dashboard verileri alinamadi"
        description="Baglanti veya sunucu durumunu kontrol ederek tekrar deneyebilirsiniz."
        onRetry={loadData}
      />
    );
  }

  const executiveWidgets = enterpriseService.getExecutiveWidgets();

  const columns = [
    {
      header: "Islem",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.note || row.type}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{row.transactionNumber}</p>
        </div>
      ),
    },
    {
      header: "Cari",
      render: (row) => row.currentAccount?.name || "-",
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Yonu",
      render: (row) => (
        <StatusBadge value={row.direction}>
          {row.direction === "in" ? "Giris" : "Cikis"}
        </StatusBadge>
      ),
    },
    {
      header: "Tutar",
      render: (row) => (
        <span className={row.direction === "in" ? "font-semibold text-accent-600" : "font-semibold text-danger-500"}>
          {formatCurrency(row.amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finansal Ozet"
        title="Operasyon ve raporlama tek bakista"
        description="Kritik metrikleri, likidite durumunu, son hareketleri ve uyarilari ayni panelde izleyerek gunluk muhasebe kontrolunu hizlandirin."
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <MetricCard
          title="Toplam Gelir"
          value={data.summary.totalIncome}
          tone="positive"
          subtitle="Tum donem tahsil edilen gelirler"
          icon={CircleDollarSign}
        />
        <MetricCard
          title="Toplam Gider"
          value={data.summary.totalExpense}
          tone="negative"
          subtitle="Kayitli operasyonel harcamalar"
          icon={CreditCard}
        />
        <MetricCard
          title="Net Bakiye"
          value={data.summary.netBalance}
          tone={data.summary.netBalance >= 0 ? "positive" : "negative"}
          subtitle="Gelir ve gider farki"
          icon={Landmark}
        />
        <MetricCard
          title="Tahsil Edilen Odemeler"
          value={data.summary.collectedPayments}
          subtitle="Bu ay icindeki tahsilatlar"
          icon={Banknote}
        />
        <MetricCard
          title="Bekleyen Alacaklar"
          value={data.summary.pendingReceivables}
          subtitle={`${data.summary.activeCurrents} aktif cariyle iliskili bakiyeler`}
          icon={ReceiptText}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Aylik Gelir - Gider Trendi"
          description="Son alti ayin finansal akis ritmini karsilastirin."
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.monthlyTrend}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1d86ff" stopOpacity={0.36} />
                    <stop offset="100%" stopColor="#1d86ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.26} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e6ecf5" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}K`} tickLine={false} axisLine={false} />
                <Tooltip formatter={tooltipFormatter} />
                <Area type="monotone" dataKey="income" stroke="#1d86ff" fill="url(#incomeFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#f97316" fill="url(#expenseFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Gider Dagilimi"
          description="Kategori bazli harcama yogunlugunu izleyin."
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.expenseCategoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={105}
                >
                  {data.charts.expenseCategoryBreakdown.map((entry, index) => (
                    <Cell key={entry.category} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3">
            {data.charts.expenseCategoryBreakdown.slice(0, 4).map((item, index) => (
              <div key={item.category} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span className="text-sm font-medium text-ink">{item.category}</span>
                </div>
                <span className="text-sm font-semibold text-ink">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <SectionCard
          title="Son Islemler"
          description="Kritik para giris ve cikis hareketleri."
        >
          <DataTable
            columns={columns}
            data={data.latestTransactions}
            emptyTitle="Islem bulunamadi"
            emptyDescription="Heniz hareket olusmamis gorunuyor."
          />
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Kritik Uyarilar"
            description="Anlik aksiyon gerektiren konular."
          >
            <div className="space-y-3">
              {data.alerts.length ? (
                data.alerts.map((alert) => (
                  <div key={alert.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-2xl bg-white p-2 shadow-soft">
                        <AlertTriangle className="h-4 w-4 text-warning-600" />
                      </div>
                      <div>
                        <StatusBadge value={alert.type}>{alert.type}</StatusBadge>
                        <h4 className="mt-2 font-heading text-lg font-bold text-ink">{alert.title}</h4>
                        <p className="mt-2 text-sm text-muted">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-muted">
                  Kritik bir uyarı bulunmuyor. Finansal akış stabil görünüyor.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Likidite Ozeti"
            description="Kasa ve banka tarafindaki dagilimi izleyin."
          >
            <div className="grid gap-3">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm text-muted">Toplam Kasa Bakiyesi</p>
                <p className="mt-2 font-heading text-2xl font-extrabold text-ink">
                  {formatCurrency(data.liquidity.cashBalance)}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm text-muted">Toplam Banka Bakiyesi</p>
                <p className="mt-2 font-heading text-2xl font-extrabold text-ink">
                  {formatCurrency(data.liquidity.bankBalance)}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Operasyon Gosterge Paneli"
        description="Stok, teklif, siparis ve belge akislarini finansal gorunumle birlikte izleyin."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Kritik Stok"
            value={executiveWidgets.criticalStocks.length}
            isCurrency={false}
            tone="negative"
            icon={Boxes}
            subtitle="Minimum seviyenin altindaki urunler"
          />
          <MetricCard
            title="Acik Teklif"
            value={executiveWidgets.openOffers}
            isCurrency={false}
            icon={ReceiptText}
            subtitle="Muzakere ve gonderim asamasinda"
          />
          <MetricCard
            title="Acik Siparis"
            value={executiveWidgets.openOrders}
            isCurrency={false}
            icon={ShoppingCart}
            subtitle="Tamamlanmamis ticari akislar"
          />
          <MetricCard
            title="Belge Inceleme"
            value={executiveWidgets.waitingDocuments}
            isCurrency={false}
            icon={FolderOpen}
            subtitle="Kontrol bekleyen dokumanlar"
          />
        </div>
      </SectionCard>

      <SectionCard title="Hizli Islem Kartlari" description="Sik kullanilan operasyon akislari icin hizli erisim.">
        <div className="grid gap-4 xl:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-[28px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-ink hover:text-white"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft transition group-hover:bg-white/10 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-5 font-heading text-xl font-bold">{item.title}</h4>
                <p className="mt-2 text-sm text-muted transition group-hover:text-white/72">
                  {item.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Modulu ac
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};
