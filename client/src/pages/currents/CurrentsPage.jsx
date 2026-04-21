import { Eye, Pencil, Plus, RotateCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { ErrorState } from "../../components/common/ErrorState";
import { FieldGroup, Input, Select } from "../../components/common/FormControls";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { Modal } from "../../components/common/Modal";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { CurrentForm } from "../../components/forms/CurrentForm";
import { currentTypeOptions } from "../../constants/options";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { currentService } from "../../services/currentService";
import {
  formatCurrency,
  formatDate,
  getOptionLabel,
} from "../../utils/formatters";

const initialFilterState = {
  search: "",
  type: "",
};

const moduleLabels = {
  invoice: "Fatura",
  invoice_payment: "Tahsilat",
  income: "Gelir",
  expense: "Gider",
};

export const CurrentsPage = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === ROLES.VIEWER;
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(initialFilterState);
  const [draftFilters, setDraftFilters] = useState(initialFilterState);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statementItem, setStatementItem] = useState(null);
  const [statementData, setStatementData] = useState(null);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatementLoading, setIsStatementLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await currentService.list({ ...filters, limit: 50 });
      setRecords(response.data);
      setMeta(response.meta);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const closeStatement = () => {
    setStatementItem(null);
    setStatementData(null);
    setIsStatementOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      if (editingItem?._id) {
        await currentService.update(editingItem._id, values);
        toast.success("Cari hesap guncellendi.");
      } else {
        await currentService.create(values);
        toast.success("Yeni cari hesap olusturuldu.");
      }

      closeModal();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cari hesap kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatement = async (item) => {
    try {
      setStatementItem(item);
      setIsStatementOpen(true);
      setIsStatementLoading(true);
      const response = await currentService.getStatement(item._id);
      setStatementData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cari ekstresi getirilemedi.");
      closeStatement();
    } finally {
      setIsStatementLoading(false);
    }
  };

  const columns = [
    {
      header: "Cari Adi",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.email || row.phone || "Iletisim bilgisi yok"}</p>
        </div>
      ),
    },
    {
      header: "Tip",
      render: (row) => getOptionLabel("currentType", row.type),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status === "active" ? "Aktif" : "Pasif"}</StatusBadge>,
    },
    {
      header: "Bakiye",
      render: (row) => (
        <span className={row.balance >= 0 ? "font-semibold text-brand-700" : "font-semibold text-danger-500"}>
          {formatCurrency(row.balance)}
        </span>
      ),
    },
    {
      header: "Notlar",
      render: (row) => row.notes || "-",
    },
    {
      header: "Aksiyonlar",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" icon={Eye} onClick={() => openStatement(row)}>
            Ekstre
          </Button>
          {!isReadOnly ? (
            <Button
              size="sm"
              variant="ghost"
              icon={Pencil}
              onClick={() => {
                setEditingItem(row);
                setIsModalOpen(true);
              }}
            >
              Duzenle
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const movementColumns = [
    {
      header: "Modul",
      render: (row) => moduleLabels[row.module] || row.module,
    },
    {
      header: "Aciklama",
      render: (row) => row.title,
    },
    {
      header: "Yon",
      render: (row) => (
        <StatusBadge value={row.direction}>{row.direction === "credit" ? "Alacak" : "Borc"}</StatusBadge>
      ),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Tutar",
      render: (row) => (
        <span className={row.direction === "credit" ? "font-semibold text-accent-600" : "font-semibold text-danger-500"}>
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  if (isLoading) {
    return <LoadingState label="Cari hesaplar yukleniyor..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Cari hesap modulu yuklenemedi"
        description="Cari listeleme servisinde gecici bir hata olusmus olabilir."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cari Hesaplar"
        title="Musteri ve tedarikci bakiyelerini yonetin"
        description="Cari kartlar, ekstreler ve borc-alacak takibi ayni modulde toplanir."
        actions={
          !isReadOnly && (
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
            >
              Yeni Cari
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Toplam Bakiye" value={meta?.summary?.totalBalance || 0} />
        <MetricCard title="Pozitif Bakiye" value={meta?.summary?.positiveBalanceCount || 0} isCurrency={false} subtitle="Tahsilat bekleyen cari sayisi" />
        <MetricCard title="Negatif Bakiye" value={meta?.summary?.negativeBalanceCount || 0} isCurrency={false} subtitle="Odeme planinda olan cari sayisi" />
      </div>

      <SectionCard title="Filtreler" description="Cari tipi veya isim bazli arama ile listeyi daraltin.">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_auto_auto]">
          <FieldGroup label="Arama">
            <Input
              value={draftFilters.search}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Firma adi, telefon veya e-posta"
            />
          </FieldGroup>
          <FieldGroup label="Cari tipi">
            <Select
              value={draftFilters.type}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, type: event.target.value }))}
            >
              <option value="">Tum tipler</option>
              {currentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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

      <SectionCard title="Cari Listesi" description="Her cari icin bakiye ve ekstre aksiyonu tabloda sunulur.">
        <DataTable
          columns={columns}
          data={records}
          emptyTitle="Cari hesap bulunamadi"
          emptyDescription="Filtreleri degistirerek farkli cari kartlari inceleyebilirsiniz."
        />
      </SectionCard>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingItem ? "Cari karti duzenle" : "Yeni cari karti"}
        description="Musteri veya tedarikci kartini iletisim ve yasal bilgilerle birlikte tanimlayin."
      >
        <CurrentForm
          initialValues={editingItem}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        open={isStatementOpen}
        onClose={closeStatement}
        title={statementItem ? `${statementItem.name} ekstresi` : "Cari ekstre"}
        description="Cari hareketleri, faturalar ve tahsilat gecmisi tek tabloda birlesir."
        size="xl"
      >
        {isStatementLoading || !statementData ? (
          <LoadingState label="Cari ekstre verileri yukleniyor..." />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-4">
              <MetricCard title="Cari Bakiye" value={statementData.summary.balance} />
              <MetricCard title="Fatura Toplami" value={statementData.summary.invoiceTotal} />
              <MetricCard title="Kalan Tutar" value={statementData.summary.outstandingTotal} />
              <MetricCard title="Tahsil / Odeme Akisi" value={statementData.summary.incomeCollections - statementData.summary.expenseTotal} subtitle="Gelir ve gider farki" />
            </div>

            <SectionCard title="Hareket Gecmisi">
              <DataTable
                columns={movementColumns}
                data={statementData.movements}
                emptyTitle="Hareket bulunamadi"
                emptyDescription="Bu cari icin hareket kaydi mevcut degil."
              />
            </SectionCard>
          </div>
        )}
      </Modal>
    </div>
  );
};

