import { CalendarClock, CalendarDays, Landmark, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EnterpriseTablePage } from "../../components/enterprise/EnterpriseTablePage";
import { EnterpriseRecordForm } from "../../components/forms/EnterpriseRecordForm";
import { SectionCard } from "../../components/common/SectionCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { enterpriseService } from "../../services/enterpriseService";
import { formatDate } from "../../utils/formatters";

export const CalendarPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventFields = [
    { name: "title", label: "Etkinlik basligi", rules: { required: "Baslik zorunludur." }, placeholder: "Vergi odeme son gunu" },
    { name: "date", label: "Tarih", type: "date", defaultValue: new Date() },
    {
      name: "type",
      label: "Tip",
      type: "select",
      options: [
        { value: "collection_due", label: "Tahsilat vadesi" },
        { value: "payment_due", label: "Odeme vadesi" },
        { value: "tax", label: "Vergi" },
      ],
      defaultValue: "payment_due",
    },
    { name: "owner", label: "Sorumlu ekip", placeholder: "Finans" },
    {
      name: "status",
      label: "Durum",
      type: "select",
      options: [{ value: "upcoming", label: "Yaklasiyor" }],
      defaultValue: "upcoming",
    },
  ];

  const handleCreate = async (values) => {
    try {
      setIsSubmitting(true);
      await Promise.resolve(enterpriseService.createCalendarEvent(values));
      toast.success("Yeni takvim kaydi olusturuldu.");
      setIsOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Takvim kaydi olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Takvim Kaydi",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.owner}</p>
        </div>
      ),
    },
    {
      header: "Tarih",
      render: (row) => formatDate(row.date),
    },
    {
      header: "Tip",
      render: (row) => <StatusBadge value={row.type}>{row.type}</StatusBadge>,
    },
    {
      header: "Durum",
      render: (row) => <StatusBadge value={row.status}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <>
      <EnterpriseTablePage
      eyebrow="Takvim ve Hatirlatmalar"
      title="Vade, vergi ve tahsilat takvimini planli sekilde yonetin"
      description="Yaklasan finansal tarihler ve operasyonel hatirlatmalarin tamamini tek timeline icinde toplayin."
      loader={enterpriseService.listCalendarEvents}
      refreshKey={refreshKey}
      columns={columns}
      searchPlaceholder="Etkinlik basligi, sorumlu ekip veya tip ile arayin"
      tableTitle="Takvim Kayitlari"
      tableDescription="Yaklasan odeme, tahsilat ve vergi takvimi olaylarini izleyin."
      emptyTitle="Takvim kaydi bulunamadi"
      emptyDescription="Planlanmis kayit bulunmuyor."
      buildMetrics={({ summary }) => [
        { title: "Toplam Etkinlik", value: summary.total || 0, isCurrency: false, icon: CalendarDays },
        { title: "Yaklasan Kayit", value: summary.upcoming || 0, isCurrency: false, icon: CalendarClock },
        { title: "Vergi Hatirlatmasi", value: summary.taxEvents || 0, isCurrency: false, icon: Landmark },
      ]}
      actions={
        <Button variant="secondary" icon={Plus} onClick={() => setIsOpen(true)}>
          Yeni Takvim Kaydi
        </Button>
      }
      renderSideContent={({ rows }) => (
        <SectionCard
          title="Yaklasan Tarihler"
          description="Bu hafta icinde aksiyon gerektiren kayitlar."
        >
          <div className="space-y-3">
            {rows.slice(0, 4).map((row) => (
              <div key={row._id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-semibold text-ink">{row.title}</p>
                <p className="mt-2 text-sm text-muted">{row.owner}</p>
                <p className="mt-1 text-sm text-muted">{formatDate(row.date)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      />
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni takvim kaydi"
        description="Tahsilat, odeme veya vergi takvimi icin yeni hatirlatma ekleyin."
      >
        <EnterpriseRecordForm
          fields={eventFields}
          onSubmit={handleCreate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Kaydi Kaydet"
        />
      </Modal>
    </>
  );
};
