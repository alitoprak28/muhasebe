import { Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/common/Button";
import { LoadingState } from "../../components/common/LoadingState";
import { Modal } from "../../components/common/Modal";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { MetricCard } from "../../components/common/MetricCard";
import { ErrorState } from "../../components/common/ErrorState";
import { FieldGroup, Input, Select } from "../../components/common/FormControls";
import { IncomeForm } from "../../components/forms/IncomeForm";
import { incomeCategoryOptions } from "../../constants/options";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { accountService } from "../../services/accountService";
import { currentService } from "../../services/currentService";
import { incomeService } from "../../services/incomeService";
import {
  formatCurrency,
  formatDate,
  getAccountDisplayName,
  getOptionLabel,
} from "../../utils/formatters";

const initialFilterState = {
  search: "",
  category: "",
  startDate: "",
  endDate: "",
};

export const IncomesPage = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === ROLES.VIEWER;
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [currents, setCurrents] = useState([]);
  const [cashAccounts, setCashAccounts] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [filters, setFilters] = useState(initialFilterState);
  const [draftFilters, setDraftFilters] = useState(initialFilterState);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const [incomeResponse, currentResponse, cashResponse, bankResponse] = await Promise.all([
        incomeService.list({ ...filters, limit: 20 }),
        currentService.list({ limit: 100 }),
        accountService.listCash({ limit: 100 }),
        accountService.listBanks({ limit: 100 }),
      ]);

      setRecords(incomeResponse.data);
      setMeta(incomeResponse.meta);
      setCurrents(currentResponse.data);
      setCashAccounts(cashResponse.data);
      setBankAccounts(bankResponse.data);
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

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      if (editingItem?._id) {
        await incomeService.update(editingItem._id, values);
        toast.success("Gelir kaydi guncellendi.");
      } else {
        await incomeService.create(values);
        toast.success("Yeni gelir kaydi olusturuldu.");
      }

      closeModal();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gelir kaydi islenemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`${item.title} kaydini silmek istediginize emin misiniz?`);

    if (!confirmed) {
      return;
    }

    try {
      await incomeService.remove(item._id);
      toast.success("Gelir kaydi silindi.");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gelir kaydi silinemedi.");
    }
  };

  const columns = [
    {
      header: "Gelir Basligi",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.documentNumber || "Belge no yok"}</p>
        </div>
      ),
    },
    {
      header: "Cari",
      render: (row) => row.currentAccount?.name || "-",
    },
    {
      header: "Kategori",
      render: (row) => getOptionLabel("income", row.category),
    },
    {
      header: "Hesap",
      render: (row) => getAccountDisplayName(row.account),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-accent-600">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Aksiyonlar",
      render: (row) =>
        isReadOnly ? (
          <span className="text-xs text-muted">Salt goruntuleme</span>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => {
              setEditingItem(row);
              setIsModalOpen(true);
            }}>
              Duzenle
            </Button>
            <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(row)}>
              Sil
            </Button>
          </div>
        ),
    },
  ];

  if (isLoading) {
    return <LoadingState label="Gelir verileri yukleniyor..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Gelir modulu yuklenemedi"
        description="API veya veritabani baglantisi kontrol edilerek tekrar denenebilir."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gelir Yonetimi"
        title="Tahsil edilen finansal akislar"
        description="Gelir kalemlerini, tahsilat kanallarini ve cari iliskilerini filtreleyerek yonetin."
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
              Yeni Gelir
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Kayitli Gelir Tutari" value={meta?.summary?.totalAmount || 0} tone="positive" />
        <MetricCard title="Listelenen Kayit" value={meta?.total || 0} isCurrency={false} subtitle="Mevcut filtreye gore" />
        <MetricCard title="Aktif Cari Sayisi" value={currents.length} isCurrency={false} subtitle="Iliskilendirilebilir cari hesap" />
      </div>

      <SectionCard title="Filtreler" description="Belirli donem, kategori ve anahtar kelimelere gore gelir kayitlarini daraltin.">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto]">
          <FieldGroup label="Arama">
            <Input
              value={draftFilters.search}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Baslik veya belge no ile ara"
            />
          </FieldGroup>
          <FieldGroup label="Kategori">
            <Select
              value={draftFilters.category}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option value="">Tum kategoriler</option>
              {incomeCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FieldGroup>
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

      <SectionCard title="Gelir Kayitlari" description="Tablo icinden duzenleme, silme ve hizli analiz yapabilirsiniz.">
        <DataTable
          columns={columns}
          data={records}
          emptyTitle="Gelir kaydi bulunamadi"
          emptyDescription="Filtreleri genisleterek farkli kayitlari goruntuleyebilirsiniz."
        />
      </SectionCard>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingItem ? "Gelir kaydini duzenle" : "Yeni gelir kaydi"}
        description="Gelir kalemini hesap ve cari iliskisiyle birlikte sisteme kaydedin."
      >
        <IncomeForm
          initialValues={editingItem}
          currents={currents}
          cashAccounts={cashAccounts}
          bankAccounts={bankAccounts}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

