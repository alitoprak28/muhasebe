import { BarChart3, Pencil, Plus } from "lucide-react";
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
import {
  BankAccountForm,
  CashAccountForm,
} from "../../components/forms/AccountForm";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { accountService } from "../../services/accountService";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export const AccountsPage = ({ mode = "all" }) => {
  const { user } = useAuth();
  const isReadOnly = user?.role === ROLES.VIEWER;
  const [cashAccounts, setCashAccounts] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formType, setFormType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movementData, setMovementData] = useState(null);
  const [movementTitle, setMovementTitle] = useState("");
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  const [isMovementLoading, setIsMovementLoading] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const [cashResponse, bankResponse] = await Promise.all([
        accountService.listCash({ limit: 100 }),
        accountService.listBanks({ limit: 100 }),
      ]);

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
  }, []);

  const closeModal = () => {
    setFormType(null);
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const openCashModal = (item = null) => {
    setFormType("cash");
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openBankModal = (item = null) => {
    setFormType("bank");
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openMovements = async (type, item) => {
    try {
      setIsMovementOpen(true);
      setIsMovementLoading(true);
      setMovementTitle(type === "cash" ? item.name : `${item.bankName} / ${item.accountName}`);
      const response =
        type === "cash"
          ? await accountService.getCashMovements(item._id)
          : await accountService.getBankMovements(item._id);
      setMovementData({ ...response, type });
    } catch (error) {
      toast.error(error.response?.data?.message || "Hesap hareketleri getirilemedi.");
      setIsMovementOpen(false);
    } finally {
      setIsMovementLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      if (formType === "cash") {
        if (editingItem?._id) {
          await accountService.updateCash(editingItem._id, values);
          toast.success("Kasa hesabi guncellendi.");
        } else {
          await accountService.createCash(values);
          toast.success("Yeni kasa hesabi olusturuldu.");
        }
      }

      if (formType === "bank") {
        if (editingItem?._id) {
          await accountService.updateBank(editingItem._id, values);
          toast.success("Banka hesabi guncellendi.");
        } else {
          await accountService.createBank(values);
          toast.success("Yeni banka hesabi olusturuldu.");
        }
      }

      closeModal();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Hesap kaydi yapilamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const movementColumns = [
    {
      header: "Islem",
      render: (row) => row.note || row.type,
    },
    {
      header: "Tarih",
      render: (row) => formatDateTime(row.date),
    },
    {
      header: "Yon",
      render: (row) => <StatusBadge value={row.direction}>{row.direction === "in" ? "Giris" : "Cikis"}</StatusBadge>,
    },
    {
      header: "Cari",
      render: (row) => row.currentAccount?.name || "-",
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

  const showCash = mode !== "bank";
  const showBank = mode !== "cash";
  const pageCopy =
    mode === "cash"
      ? {
          eyebrow: "Kasa Yonetimi",
          title: "Nakit pozisyonlarini kasa bazinda yonetin",
          description: "Nakit akisini kasalar, sayim mantigi ve son hareket detaylariyla birlikte izleyin.",
        }
      : mode === "bank"
        ? {
            eyebrow: "Banka Yonetimi",
            title: "Banka hesaplari ve hareketlerini kontrol edin",
            description: "Kurumsal banka hesaplarini, IBAN bilgilerini ve hareket akislarini ayri bir ekranda yonetin.",
          }
        : {
            eyebrow: "Kasa ve Banka",
            title: "Likiditeyi hesap bazinda yonetin",
            description: "Kasa ve banka hesaplarini ayri ayri izleyip hareketlerini detay tablosunda analiz edin.",
          };

  const cashColumns = [
    {
      header: "Kasa",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.code}</p>
        </div>
      ),
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status === "active" ? "Aktif" : "Pasif"}</StatusBadge>,
    },
    {
      header: "Bakiye",
      render: (row) => <span className="font-semibold text-brand-700">{formatCurrency(row.balance)}</span>,
    },
    {
      header: "Varsayilan",
      render: (row) => (row.isDefault ? <StatusBadge value="active">Evet</StatusBadge> : "-"),
    },
    {
      header: "Aksiyonlar",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" icon={BarChart3} onClick={() => openMovements("cash", row)}>
            Hareket
          </Button>
          {!isReadOnly ? (
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openCashModal(row)}>
              Duzenle
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const bankColumns = [
    {
      header: "Banka Hesabi",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.bankName}</p>
          <p className="text-xs text-muted">{row.accountName}</p>
        </div>
      ),
    },
    {
      header: "IBAN",
      render: (row) => row.iban,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status === "active" ? "Aktif" : "Pasif"}</StatusBadge>,
    },
    {
      header: "Bakiye",
      render: (row) => <span className="font-semibold text-brand-700">{formatCurrency(row.balance)}</span>,
    },
    {
      header: "Aksiyonlar",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" icon={BarChart3} onClick={() => openMovements("bank", row)}>
            Hareket
          </Button>
          {!isReadOnly ? (
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openBankModal(row)}>
              Duzenle
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState label="Kasa ve banka hesaplari yukleniyor..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Hesap modulu yuklenemedi"
        description="Kasa veya banka servislerinden veri alinamadi."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={pageCopy.eyebrow}
        title={pageCopy.title}
        description={pageCopy.description}
      />

      <div className={`grid gap-4 ${showCash && showBank ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
        {showCash ? (
          <MetricCard title="Toplam Kasa Bakiyesi" value={cashAccounts.reduce((sum, item) => sum + item.balance, 0)} />
        ) : null}
        {showBank ? (
          <MetricCard title="Toplam Banka Bakiyesi" value={bankAccounts.reduce((sum, item) => sum + item.balance, 0)} />
        ) : null}
      </div>

      {showCash ? (
        <SectionCard
          title="Kasa Hesaplari"
          description="Operasyonel nakit akisini izlemek icin kasalari yonetin."
          action={
            !isReadOnly && (
              <Button variant="secondary" icon={Plus} onClick={() => openCashModal()}>
                Yeni Kasa
              </Button>
            )
          }
        >
          <DataTable
            columns={cashColumns}
            data={cashAccounts}
            emptyTitle="Kasa hesabi bulunamadi"
            emptyDescription="Yeni bir kasa ekleyerek nakit akisini izlemeye baslayin."
          />
        </SectionCard>
      ) : null}

      {showBank ? (
        <SectionCard
          title="Banka Hesaplari"
          description="Kurumsal banka hesaplarini tek ekrandan izleyin."
          action={
            !isReadOnly && (
              <Button variant="secondary" icon={Plus} onClick={() => openBankModal()}>
                Yeni Banka Hesabi
              </Button>
            )
          }
        >
          <DataTable
            columns={bankColumns}
            data={bankAccounts}
            emptyTitle="Banka hesabi bulunamadi"
            emptyDescription="Yeni bir banka hesabi ekleyerek tahsilat ve odemeleri baglayin."
          />
        </SectionCard>
      ) : null}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={
          formType === "cash"
            ? editingItem
              ? "Kasa hesabini duzenle"
              : "Yeni kasa hesabi"
            : editingItem
              ? "Banka hesabini duzenle"
              : "Yeni banka hesabi"
        }
        description="Hesap bilgilerini standart ve tutarli bir formatta tanimlayin."
      >
        {formType === "cash" ? (
          <CashAccountForm
            initialValues={editingItem}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        ) : (
          <BankAccountForm
            initialValues={editingItem}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        open={isMovementOpen}
        onClose={() => setIsMovementOpen(false)}
        title={movementTitle ? `${movementTitle} hareketleri` : "Hareketler"}
        description="Secili hesap icin son finansal giris ve cikislar."
        size="xl"
      >
        {isMovementLoading || !movementData ? (
          <LoadingState label="Hesap hareketleri yukleniyor..." />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <MetricCard title="Toplam Giris" value={movementData.meta?.summary?.totalIn || 0} />
              <MetricCard title="Toplam Cikis" value={movementData.meta?.summary?.totalOut || 0} />
              <MetricCard title="Kapanis Bakiyesi" value={movementData.meta?.summary?.closingBalance || 0} />
            </div>
            <DataTable
              columns={movementColumns}
              data={movementData.data}
              emptyTitle="Hareket bulunamadi"
              emptyDescription="Bu hesap icin hareket kaydi bulunmuyor."
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
