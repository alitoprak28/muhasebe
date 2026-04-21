import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/common/Button";
import { ErrorState } from "../../components/common/ErrorState";
import { FieldGroup, Input, Select } from "../../components/common/FormControls";
import { LoadingState } from "../../components/common/LoadingState";
import { MetricCard } from "../../components/common/MetricCard";
import { PageHeader } from "../../components/common/PageHeader";
import { SectionCard } from "../../components/common/SectionCard";
import { enterpriseService } from "../../services/enterpriseService";

const currencyOptions = ["TRY", "USD", "EUR"];

export const SettingsPage = () => {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await Promise.resolve(enterpriseService.getSettings());
      setForm(response);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await Promise.resolve(enterpriseService.updateSettings(form));
      setForm(response);
      toast.success("Firma ve belge ayarlari guncellendi.");
    } catch (error) {
      toast.error("Ayarlar kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState label="Sistem ayarlari yukleniyor..." />;
  }

  if (hasError || !form) {
    return (
      <ErrorState
        title="Ayarlar yuklenemedi"
        description="Firma ve finans ayarlari okunamadi."
        onRetry={loadData}
      />
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <PageHeader
        eyebrow="Ayarlar"
        title="Firma, belge ve finans varsayimlarini yonetin"
        description="Kurumsal kimlik, belge serileri ve varsayilan finans tercihlerini tek merkezde yonetin."
        actions={
          <Button type="submit" variant="secondary" icon={Save} disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor" : "Degisiklikleri Kaydet"}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Firma Unvani" value={form.company.title} isCurrency={false} />
        <MetricCard title="Varsayilan Para Birimi" value={form.documents.defaultCurrency} isCurrency={false} />
        <MetricCard title="Varsayilan Banka" value={form.finance.defaultBankAccount} isCurrency={false} />
      </div>

      <SectionCard
        title="Firma Bilgileri"
        description="Belge basligi, iletisim bilgileri ve vergi tanimlarini guncel tutun."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Firma Unvani">
            <Input value={form.company.title} onChange={(event) => updateField("company", "title", event.target.value)} />
          </FieldGroup>
          <FieldGroup label="Vergi Dairesi">
            <Input value={form.company.taxOffice} onChange={(event) => updateField("company", "taxOffice", event.target.value)} />
          </FieldGroup>
          <FieldGroup label="Vergi No">
            <Input value={form.company.taxNumber} onChange={(event) => updateField("company", "taxNumber", event.target.value)} />
          </FieldGroup>
          <FieldGroup label="E-posta">
            <Input value={form.company.email} onChange={(event) => updateField("company", "email", event.target.value)} />
          </FieldGroup>
          <FieldGroup label="Telefon">
            <Input value={form.company.phone} onChange={(event) => updateField("company", "phone", event.target.value)} />
          </FieldGroup>
          <FieldGroup label="IBAN">
            <Input value={form.company.iban} onChange={(event) => updateField("company", "iban", event.target.value)} />
          </FieldGroup>
          <div className="md:col-span-2">
            <FieldGroup label="Adres">
              <Input value={form.company.address} onChange={(event) => updateField("company", "address", event.target.value)} />
            </FieldGroup>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Belge Ayarlari"
          description="Belge serileri, varsayilan KDV ve para birimi tercihlerini belirleyin."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup label="Varsayilan Para Birimi">
              <Select
                value={form.documents.defaultCurrency}
                onChange={(event) => updateField("documents", "defaultCurrency", event.target.value)}
              >
                {currencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup label="Varsayilan KDV">
              <Input
                type="number"
                value={form.documents.defaultVatRate}
                onChange={(event) => updateField("documents", "defaultVatRate", Number(event.target.value))}
              />
            </FieldGroup>
            <FieldGroup label="Fatura Serisi">
              <Input value={form.documents.invoiceSeries} onChange={(event) => updateField("documents", "invoiceSeries", event.target.value)} />
            </FieldGroup>
            <FieldGroup label="Irsaliye Serisi">
              <Input value={form.documents.dispatchSeries} onChange={(event) => updateField("documents", "dispatchSeries", event.target.value)} />
            </FieldGroup>
            <FieldGroup label="Teklif Serisi">
              <Input value={form.documents.offerSeries} onChange={(event) => updateField("documents", "offerSeries", event.target.value)} />
            </FieldGroup>
          </div>
        </SectionCard>

        <SectionCard
          title="Finans Ayarlari"
          description="Varsayilan kasa, banka ve hesap plani profili tercihleriniz."
        >
          <div className="grid gap-4">
            <FieldGroup label="Varsayilan Kasa">
              <Input
                value={form.finance.defaultCashAccount}
                onChange={(event) => updateField("finance", "defaultCashAccount", event.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Varsayilan Banka">
              <Input
                value={form.finance.defaultBankAccount}
                onChange={(event) => updateField("finance", "defaultBankAccount", event.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Kur Kaynagi">
              <Input
                value={form.finance.exchangeSource}
                onChange={(event) => updateField("finance", "exchangeSource", event.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Hesap Plani Profili">
              <Input
                value={form.finance.chartOfAccountProfile}
                onChange={(event) => updateField("finance", "chartOfAccountProfile", event.target.value)}
              />
            </FieldGroup>
          </div>
        </SectionCard>
      </div>
    </form>
  );
};
