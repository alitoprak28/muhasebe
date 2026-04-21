import { Boxes, BriefcaseBusiness, ChartNoAxesColumn } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/common/DataTable";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatCurrency } from "../../utils/formatters";

export const CatalogPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await Promise.resolve(enterpriseService.getCatalogOverview());
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
    return <LoadingState label="Urun ve hizmet katalogu yukleniyor..." />;
  }

  if (hasError || !data) {
    return (
      <ErrorState
        title="Katalog modulu acilamadi"
        description="Urun ve hizmet kartlari getirilemedigi icin ekran olusturulamadi."
        onRetry={loadData}
      />
    );
  }

  const productColumns = [
    {
      header: "Urun",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.stockCode}</p>
        </div>
      ),
    },
    {
      header: "Grup / Marka",
      render: (row) => `${row.productGroup} / ${row.brand}`,
    },
    {
      header: "KDV",
      render: (row) => `%${row.vatRate}`,
    },
    {
      header: "Alis",
      render: (row) => formatCurrency(row.purchasePrice),
    },
    {
      header: "Satis",
      render: (row) => <span className="font-semibold text-accent-600">{formatCurrency(row.salePrice)}</span>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.isActive ? "active" : "inactive"}>{row.isActive ? "Aktif" : "Pasif"}</StatusBadge>,
    },
  ];

  const serviceColumns = [
    {
      header: "Hizmet",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.serviceCode}</p>
        </div>
      ),
    },
    {
      header: "Aciklama",
      render: (row) => row.description,
    },
    {
      header: "Gelir Hesabi",
      render: (row) => row.incomeAccount,
    },
    {
      header: "Gider Hesabi",
      render: (row) => row.expenseAccount,
    },
    {
      header: "KDV",
      render: (row) => `%${row.vatRate}`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Urun ve Hizmetler"
        title="Ticari kartlar ve fiyatlandirma yapisi"
        description="Stoklu urunler ile operasyonel hizmet kartlarini ayni katalog stratejisi icinde yonetin."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Aktif Urun" value={data.metrics.activeProducts} isCurrency={false} icon={Boxes} />
        <MetricCard title="Aktif Hizmet" value={data.metrics.activeServices} isCurrency={false} icon={BriefcaseBusiness} />
        <MetricCard
          title="Ortalama Marj"
          value={`%${data.metrics.averageProductMargin}`}
          isCurrency={false}
          subtitle="Satis ve alis fiyatlarina gore"
          icon={ChartNoAxesColumn}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <SectionCard
          title="Urun Kartlari"
          description="Stok kodu, marka, KDV ve fiyat seviyeleri ile birlikte urun kartlarini izleyin."
        >
          <DataTable
            columns={productColumns}
            data={data.products}
            emptyTitle="Urun karti bulunamadi"
            emptyDescription="Kataloga henuz fiziksel urun eklenmemis."
          />
        </SectionCard>

        <SectionCard
          title="Katalog Standartlari"
          description="Sunum ve operasyon kalitesini koruyan temel kararlar."
        >
          <div className="space-y-3">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">Fiyat modeli</p>
              <p className="mt-2 text-sm text-muted">
                Urun kartlari alis ve satis fiyatini ayri tasir; hizmet kartlari ise muhasebe hesap
                planina dogrudan baglanir.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">Vergi tutarliligi</p>
              <p className="mt-2 text-sm text-muted">
                Her kartta KDV orani saklanir; teklif, siparis ve fatura akislarinda ayni oranlar
                tekrar kullanilir.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">Servis gelir hesabı</p>
              <p className="mt-2 text-sm text-muted">
                Hizmet kartlarinin gelir ve gider hesap kodlari onceden tanimlanarak genel muhasebe
                entegrasyonu kolaylastirilir.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Hizmet Kartlari"
        description="Kurulum, bakim ve egitim gibi operasyonel hizmetleri standart hesap eslestirmesiyle saklayin."
      >
        <DataTable
          columns={serviceColumns}
          data={data.services}
          emptyTitle="Hizmet karti bulunamadi"
          emptyDescription="Sistemde henuz hizmet karti tanimlanmamis."
        />
      </SectionCard>
    </div>
  );
};
