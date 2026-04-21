import { AlertTriangle, Boxes, PackageCheck, Plus, Warehouse } from "lucide-react";
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
import { formatDate } from "../../utils/formatters";

export const InventoryPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await Promise.resolve(enterpriseService.getInventoryOverview());
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
    return <LoadingState label="Stok ve depo verileri yukleniyor..." />;
  }

  const closeModal = () => setFormMode(null);

  const warehouseFields = [
    { name: "code", label: "Depo kodu", rules: { required: "Depo kodu zorunludur." }, placeholder: "DPO-04" },
    { name: "name", label: "Depo adi", rules: { required: "Depo adi zorunludur." }, placeholder: "Ege Sevkiyat Deposu" },
    { name: "city", label: "Sehir", placeholder: "Izmir" },
    { name: "manager", label: "Yonetici", placeholder: "Seda Yaman" },
    { name: "capacity", label: "Kapasite", type: "number", defaultValue: 0 },
    {
      name: "status",
      label: "Durum",
      type: "select",
      options: [
        { value: "active", label: "Aktif" },
        { value: "inactive", label: "Pasif" },
      ],
      defaultValue: "active",
    },
  ];

  const stockFields = [
    {
      name: "productId",
      label: "Urun",
      type: "select",
      options: data?.products?.map((item) => ({ value: item._id, label: `${item.stockCode} / ${item.name}` })) || [],
      rules: { required: "Urun seciniz." },
    },
    {
      name: "warehouseId",
      label: "Depo",
      type: "select",
      options: data?.warehouses?.map((item) => ({ value: item._id, label: item.name })) || [],
      rules: { required: "Depo seciniz." },
    },
    { name: "quantity", label: "Miktar", type: "number", defaultValue: 0 },
    { name: "reserved", label: "Rezerve", type: "number", defaultValue: 0 },
    { name: "minimumStock", label: "Minimum stok", type: "number", defaultValue: 0 },
    { name: "maximumStock", label: "Maksimum stok", type: "number", defaultValue: 0 },
    { name: "lastMovementDate", label: "Son hareket tarihi", type: "date", defaultValue: new Date() },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);

      if (formMode === "warehouse") {
        await Promise.resolve(enterpriseService.createWarehouse(values));
        toast.success("Yeni depo karti olusturuldu.");
      }

      if (formMode === "stock") {
        await Promise.resolve(enterpriseService.createStock(values));
        toast.success("Yeni stok pozisyonu olusturuldu.");
      }

      closeModal();
      await loadData();
    } catch (error) {
      toast.error("Kayit olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasError || !data) {
    return (
      <ErrorState
        title="Stok modulu acilamadi"
        description="Depo ve stok hareket ozetleri su anda olusturulamiyor."
        onRetry={loadData}
      />
    );
  }

  const stockColumns = [
    {
      header: "Urun",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.productName}</p>
          <p className="text-xs text-muted">{row.stockCode}</p>
        </div>
      ),
    },
    {
      header: "Depo",
      render: (row) => row.warehouseName,
    },
    {
      header: "Miktar",
      render: (row) => row.quantity,
    },
    {
      header: "Rezerve",
      render: (row) => row.reserved,
    },
    {
      header: "Kullanilabilir",
      render: (row) => <span className="font-semibold text-brand-700">{row.available}</span>,
    },
    {
      header: "Son Hareket",
      render: (row) => formatDate(row.lastMovementDate),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status === "critical" ? "Kritik" : "Saglikli"}</StatusBadge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Depolar ve Stok"
        title="Envanter gorunurlugunu depo bazinda yonetin"
        description="Kritik stoklari, rezerve miktarlari ve depo kapasitelerini ayni ekrandan izleyin."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" icon={Plus} onClick={() => setFormMode("warehouse")}>
              Yeni Depo
            </Button>
            <Button variant="secondary" icon={Plus} onClick={() => setFormMode("stock")}>
              Yeni Stok
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Depo Sayisi" value={data.metrics.warehouseCount} isCurrency={false} icon={Warehouse} />
        <MetricCard title="Toplam Stok" value={data.metrics.totalQuantity} isCurrency={false} icon={Boxes} />
        <MetricCard title="Rezerve Miktar" value={data.metrics.reservedQuantity} isCurrency={false} icon={PackageCheck} />
        <MetricCard title="Kritik Kalem" value={data.metrics.criticalItems} isCurrency={false} tone="negative" icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <SectionCard
          title="Stok Pozisyonlari"
          description="Minimum stok seviyesine gore kritik urunleri hizla ayristirin."
        >
          <DataTable
            columns={stockColumns}
            data={data.stocks}
            emptyTitle="Stok kaydi bulunamadi"
            emptyDescription="Depo stok kartlari henuz olusturulmamis."
          />
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Depo Kartlari"
            description="Kapasite ve operasyon yoneticileri ile depo dagilimini inceleyin."
          >
            <div className="space-y-3">
              {data.warehouses.map((warehouse) => (
                <div key={warehouse._id} className="rounded-[24px] bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{warehouse.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{warehouse.code}</p>
                    </div>
                    <StatusBadge value={warehouse.status}>{warehouse.city}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-muted">Yonetici: {warehouse.manager}</p>
                  <p className="mt-1 text-sm text-muted">Kapasite: {warehouse.capacity} birim</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Aksiyon Onerileri"
            description="Stok acigina dusen urunler icin satin alma veya transfer planlayin."
          >
            <div className="space-y-3">
              {data.stocks
                .filter((item) => item.status === "critical")
                .map((item) => (
                  <div key={item._id} className="rounded-[24px] border border-danger-100 bg-danger-50/70 p-4">
                    <p className="font-semibold text-ink">{item.productName}</p>
                    <p className="mt-2 text-sm text-muted">
                      {item.warehouseName} icin mevcut stok {item.quantity}, minimum hedef {item.minimumStock}.
                    </p>
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <Modal
        open={Boolean(formMode)}
        onClose={closeModal}
        title={formMode === "warehouse" ? "Yeni depo karti" : "Yeni stok pozisyonu"}
        description="Depo ve stok verilerini envanter operasyonuna uygun sekilde kaydedin."
      >
        <EnterpriseRecordForm
          fields={formMode === "warehouse" ? warehouseFields : stockFields}
          onSubmit={handleCreate}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
          submitLabel={formMode === "warehouse" ? "Depoyu Kaydet" : "Stok Kaydini Olustur"}
        />
      </Modal>
    </div>
  );
};
