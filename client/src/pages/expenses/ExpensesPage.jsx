import { Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
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
import { ExpenseForm } from "../../components/forms/ExpenseForm";
import { expenseCategoryOptions, expenseStatusOptions } from "../../constants/options";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { accountService } from "../../services/accountService";
import { currentService } from "../../services/currentService";
import { expenseService } from "../../services/expenseService";
import {
  formatCurrency,
  formatDate,
  getAccountDisplayName,
  getOptionLabel,
} from "../../utils/formatters";

const initialFilterState = {
  search: "",
  category: "",
  status: "",
  startDate: "",
  endDate: "",
};

export const ExpensesPage = () => {
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
      const [expenseResponse, currentResponse, cashResponse, bankResponse] = await Promise.all([
        expenseService.list({ ...filters, limit: 20 }),
        currentService.list({ limit: 100 }),
        accountService.listCash({ limit: 100 }),
        accountService.listBanks({ limit: 100 }),
      ]);

      setRecords(expenseResponse.data);
      setMeta(expenseResponse.meta);
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
        await expenseService.update(editingItem._id, values);
        toast.success("Gider kaydi guncellendi.");
      } else {
        await expenseService.create(values);
        toast.success("Yeni gider kaydi olusturuldu.");
      }

      closeModal();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gider kaydi islenemedi.");
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
      await expenseService.remove(item._id);
      toast.success("Gider kaydi silindi.");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gider kaydi silinemedi.");
    }
  };

  const columns = [
    {
      header: "Gider Basligi",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.receiptNumber || "Belge no yok"}</p>
        </div>
      ),
    },
    {
      header: "Kategori",
      render: (row) => getOptionLabel("expense", row.category),
    },
    {
      header: "Tedarikci / Cari",
      render: (row) => row.currentAccount?.name || "-",
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{getOptionLabel("expenseStatus", row.status)}</StatusBadge>,
    },
    {
      header: "Hesap",
      render: (row) => (row.account ? getAccountDisplayName(row.account) : "-"),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Tutar",
      render: (row) => <span className="font-semibold text-danger-500">{formatCurrency(row.amount)}</span>,
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
    return <LoadingState label="Gider verileri yukleniyor..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Gider modulu yuklenemedi"
        description="Sunucu tarafindaki veri akisinda bir problem olusmus olabilir."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gider Yonetimi"
        title="Operasyonel harcamalari kontrol altinda tutun"
        description="Odeme planlari, tedarikci iliskileri ve hesap baglantilarini ayni akista yonetin."
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
              Yeni Gider
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Toplam Gider" value={meta?.summary?.totalAmount || 0} tone="negative" />
        <MetricCard title="Odenen Tutar" value={meta?.summary?.paidAmount || 0} subtitle="Nakit cikisi yaratmis kayitlar" />
        <MetricCard title="Bekleyen Tutar" value={meta?.summary?.pendingAmount || 0} subtitle="Tahakkuk etmis ancak tamamlanmamis odemeler" />
      </div>

      <SectionCard title="Filtreler" description="Kategori, durum ve donem bazli giderleri ayristirin.">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_auto_auto]">
          <FieldGroup label="Arama">
            <Input
              value={draftFilters.search}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Baslik veya fis no ile ara"
            />
          </FieldGroup>
          <FieldGroup label="Kategori">
            <Select
              value={draftFilters.category}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option value="">Tum kategoriler</option>
              {expenseCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label="Durum">
            <Select
              value={draftFilters.status}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="">Tum durumlar</option>
              {expenseStatusOptions.map((option) => (
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

      <SectionCard title="Gider Kayitlari" description="Aylik ve kategorik gider akisini profesyonel sekilde takip edin.">
        <DataTable
          columns={columns}
          data={records}
          emptyTitle="Gider kaydi bulunamadi"
          emptyDescription="Filtreleri esneterek diger giderleri goruntuleyebilirsiniz."
        />
      </SectionCard>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingItem ? "Gider kaydini duzenle" : "Yeni gider kaydi"}
        description="Gider kaydini durum, odeme kanali ve tedarikci bilgileriyle birlikte olusturun."
      >
        <ExpenseForm
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
