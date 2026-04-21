import { AlertTriangle, BellRing, CheckCheck, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { EnterpriseRecordForm } from "../../components/forms/EnterpriseRecordForm";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDateTime } from "../../utils/formatters";

export const NotificationsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notificationFields = [
    { name: "title", label: "Baslik", rules: { required: "Baslik zorunludur." }, placeholder: "Vadesi gelen odeme" },
    { name: "description", label: "Aciklama", type: "textarea", className: "md:col-span-2", placeholder: "Bildirim detayini yazin" },
    {
      name: "severity",
      label: "Oncelik",
      type: "select",
      options: [
        { value: "info", label: "Bilgi" },
        { value: "warning", label: "Uyari" },
        { value: "critical", label: "Kritik" },
      ],
      defaultValue: "info",
    },
    { name: "createdAt", label: "Tarih", type: "date", defaultValue: new Date() },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createNotification(values));
      toast.success("Yeni bildirim olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Bildirim olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Bildirim",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.description}</p>
        </div>
      ),
    },
    {
      header: "Oncelik",
      render: (row) => <StatusBadge value={row.severity}>{row.severity}</StatusBadge>,
    },
    {
      header: "Olusma",
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: "Okundu",
      render: (row) => <StatusBadge value={row.read ? "active" : "warning"}>{row.read ? "Evet" : "Hayir"}</StatusBadge>,
    },
  ];

  return (
    <>
      <EnterpriseTablePage
      eyebrow="Bildirim Merkezi"
      title="Operasyon, risk ve belge uyarilarini tek akista toplayin"
      description="Kritik stok, vade ve onay bekleyen belge uyarilarini duzenli bir merkezden yonetin."
      loader={enterpriseService.listNotifications}
      refreshKey={refreshKey}
      columns={columns}
      searchPlaceholder="Bildirim basligi veya aciklamasi ile arayin"
      tableTitle="Bildirim Listesi"
      tableDescription="Okunmamis ve kritik uyarilari dogrudan onceliklendirin."
      emptyTitle="Bildirim bulunamadi"
      emptyDescription="Goruntulenecek bildirim bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Okunmamis", value: summary.unreadCount || 0, isCurrency: false, icon: BellRing },
        { title: "Kritik Uyari", value: summary.criticalCount || 0, isCurrency: false, tone: "negative", icon: AlertTriangle },
        { title: "Uyari Seviyesi", value: summary.warningCount || 0, isCurrency: false, icon: CheckCheck },
      ]}
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Bildirim
        </Button>
      }
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Bugunun Gundemi"
          description="Takip edilmesi gereken anlik sistem sinyalleri."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{row.title}</p>
                  <StatusBadge value={row.severity}>{row.severity}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">{row.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      />
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni bildirim"
        description="Panelde gorunecek yeni operasyon veya risk bildirimi ekleyin."
      >
        <EnterpriseRecordForm
          fields={notificationFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Bildirimi Kaydet"
        />
      </Modal>
    </>
  );
};
