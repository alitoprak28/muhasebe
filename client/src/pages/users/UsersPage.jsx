import { Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { ErrorState } from "../../components/common/ErrorState";
import { FieldGroup, Input } from "../../components/common/FormControls";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { Modal } from "../../components/common/Modal";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { UserForm } from "../../components/forms/UserForm";
import { userService } from "../../services/userService";
import { formatDateTime, getOptionLabel } from "../../utils/formatters";

export const UsersPage = () => {
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await userService.list({ limit: 50, search });
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
  }, [search]);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await userService.create(values);
      toast.success("Kullanici olusturuldu.");
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kullanici olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (row) => {
    const nextStatus = row.status === "active" ? "inactive" : "active";

    try {
      await userService.updateStatus(row._id, { status: nextStatus });
      toast.success("Kullanici durumu guncellendi.");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Durum guncellenemedi.");
    }
  };

  const columns = [
    {
      header: "Kullanici",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Rol",
      render: (row) => <StatusBadge value={row.role}>{getOptionLabel("userRole", row.role)}</StatusBadge>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{getOptionLabel("userStatus", row.status)}</StatusBadge>,
    },
    {
      header: "Son Giris",
      render: (row) => formatDateTime(row.lastLoginAt),
    },
    {
      header: "Aksiyonlar",
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(row)}>
          {row.status === "active" ? "Pasife Al" : "Aktif Et"}
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState label="Kullanicilar yukleniyor..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Kullanici yonetimi yuklenemedi"
        description="Yonetim verileri su anda getirilemiyor."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kullanici Yonetimi"
        title="Rol bazli erisim yapisini kontrol edin"
        description="Admin, muhasebeci ve goruntuleyici kullanicilarini tek listede yonetin."
        actions={
          <Button variant="secondary" icon={UserPlus} onClick={() => setIsModalOpen(true)}>
            Yeni Kullanici
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Toplam Kullanici" value={meta?.total || 0} isCurrency={false} />
        <MetricCard title="Admin Sayisi" value={records.filter((item) => item.role === "admin").length} isCurrency={false} />
        <MetricCard title="Aktif Kullanici" value={records.filter((item) => item.status === "active").length} isCurrency={false} />
      </div>

      <SectionCard title="Kullanici Arama" description="Ad veya e-posta ile hizli arama yapin.">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_auto]">
          <FieldGroup label="Arama">
            <Input value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} placeholder="Ad veya e-posta" />
          </FieldGroup>
          <div className="flex items-end">
            <Button className="w-full" icon={Search} onClick={() => setSearch(draftSearch)}>
              Uygula
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Kullanici Listesi">
        <DataTable
          columns={columns}
          data={records}
          emptyTitle="Kullanici bulunamadi"
          emptyDescription="Arama kriterini degistirerek tekrar deneyin."
        />
      </SectionCard>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni kullanici"
        description="Rol bazli yetki ve durum secimiyle kullanici kaydi olusturun."
      >
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};
