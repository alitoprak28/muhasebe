import { Pencil, Plus, Receipt, RotateCcw, Search, Trash2 } from "lucide-react";
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
import { InvoiceForm } from "../../components/forms/InvoiceForm";
import { InvoicePaymentForm } from "../../components/forms/InvoicePaymentForm";
import { invoiceStatusOptions } from "../../constants/options";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { accountService } from "../../services/accountService";
import { currentService } from "../../services/currentService";
import { invoiceService } from "../../services/invoiceService";
import {
  formatCurrency,
  formatDate,
  getOptionLabel,
} from "../../utils/formatters";

const initialFilterState = {
  search: "",
  status: "",
  startDate: "",
  endDate: "",
};

export const InvoicesPage = () => {
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
  const [paymentItem, setPaymentItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const [invoiceResponse, currentResponse, cashResponse, bankResponse] = await Promise.all([
        invoiceService.list({ ...filters, limit: 20 }),
        currentService.list({ limit: 100 }),
        accountService.listCash({ limit: 100 }),
        accountService.listBanks({ limit: 100 }),
      ]);

      setRecords(invoiceResponse.data);
      setMeta(invoiceResponse.meta);
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

  const closeFormModal = () => {
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const closePaymentModal = () => {
    setPaymentItem(null);
    setIsPaymentOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      if (editingItem?._id) {
        await invoiceService.update(editingItem._id, values);
        toast.success("Fatura guncellendi.");
      } else {
        await invoiceService.create(values);
        toast.success("Yeni fatura olusturuldu.");
      }

      closeFormModal();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Fatura kaydi yapilamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (values) => {
    try {
      setIsPaymentSubmitting(true);
      await invoiceService.recordPayment(paymentItem._id, values);
      toast.success("Tahsilat kaydi olusturuldu.");
      closePaymentModal();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Tahsilat kaydi yapilamadi.");
    } finally {
      setIsPaymentSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`${item.invoiceNumber} numarali faturayi silmek istiyor musunuz?`);

    if (!confirmed) {
      return;
    }

    try {
      await invoiceService.remove(item._id);
      toast.success("Fatura silindi.");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Fatura silinemedi.");
    }
  };

  const columns = [
    {
      header: "Fatura No",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.invoiceNumber}</p>
          <p className="text-xs text-muted">{row.currentAccount?.name || "-"}</p>
        </div>
      ),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{getOptionLabel("invoiceStatus", row.status)}</StatusBadge>,
    },
    {
      header: "Duzenlenme",
      render: (row) => formatDate(row.issueDate),
    },
    {
      header: "Vade",
      render: (row) => formatDate(row.dueDate),
    },
    {
      header: "Genel Toplam",
      render: (row) => <span className="font-semibold text-ink">{formatCurrency(row.grandTotal)}</span>,
    },
    {
      header: "Kalan",
      render: (row) => <span className="font-semibold text-warning-600">{formatCurrency(row.remainingAmount)}</span>,
    },
    {
      header: "Aksiyonlar",
      render: (row) =>
        isReadOnly ? (
          <span className="text-xs text-muted">Salt goruntuleme</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => {
              setEditingItem(row);
              setIsFormOpen(true);
            }}>
              Duzenle
            </Button>
            {row.status !== "paid" ? (
              <Button size="sm" variant="ghost" icon={Receipt} onClick={() => {
                setPaymentItem(row);
                setIsPaymentOpen(true);
              }}>
                Tahsilat
              </Button>
            ) : null}
            <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(row)}>
              Sil
            </Button>
          </div>
        ),
    },
  ];

  if (isLoading) {
    return <LoadingState label="Fatura verileri yukleniyor..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Fatura modulu yuklenemedi"
        description="Fatura servisiyle baglanti kurulurken hata olustu."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fatura ve Belgeler"
        title="Tahsilat sureclerini fatura bazinda izleyin"
        description="Kalem bazli toplam, KDV ve kalan tutar akisini profesyonel sekilde yonetin."
        actions={
          !isReadOnly && (
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => {
                setEditingItem(null);
                setIsFormOpen(true);
              }}
            >
              Yeni Fatura
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Fatura Toplami" value={meta?.summary?.grandTotal || 0} />
        <MetricCard title="Tahsil Edilen" value={meta?.summary?.paidAmount || 0} tone="positive" />
        <MetricCard title="Bekleyen Tutar" value={meta?.summary?.remainingAmount || 0} subtitle="Tahsilati tamamlanmamis faturalar" />
      </div>

      <SectionCard title="Filtreler" description="Durum, donem ve numaraya gore faturalari filtreleyin.">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto]">
          <FieldGroup label="Arama">
            <Input
              value={draftFilters.search}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Fatura numarasi ara"
            />
          </FieldGroup>
          <FieldGroup label="Durum">
            <Select
              value={draftFilters.status}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="">Tum durumlar</option>
              {invoiceStatusOptions.map((option) => (
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

      <SectionCard title="Fatura Listesi" description="Her faturanin kalan alacagini ve tahsilat durumunu aninda gorun.">
        <DataTable
          columns={columns}
          data={records}
          emptyTitle="Fatura bulunamadi"
          emptyDescription="Yeni bir fatura olusturarak tahsilat akisini baslatabilirsiniz."
        />
      </SectionCard>

      <Modal
        open={isFormOpen}
        onClose={closeFormModal}
        title={editingItem ? "Faturayi duzenle" : "Yeni fatura"}
        description="Fatura kalemleri, KDV ve cari iliskisiyle birlikte kaydedilir."
        size="xl"
      >
        <InvoiceForm
          initialValues={editingItem}
          currents={currents}
          onSubmit={handleSubmit}
          onCancel={closeFormModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        open={isPaymentOpen}
        onClose={closePaymentModal}
        title={paymentItem ? `${paymentItem.invoiceNumber} tahsilat kaydi` : "Tahsilat kaydi"}
        description="Kismi veya tam tahsilati uygun hesapla birlikte sisteme isleyin."
      >
        <InvoicePaymentForm
          invoice={paymentItem}
          cashAccounts={cashAccounts}
          bankAccounts={bankAccounts}
          onSubmit={handlePaymentSubmit}
          onCancel={closePaymentModal}
          isSubmitting={isPaymentSubmitting}
        />
      </Modal>
    </div>
  );
};

