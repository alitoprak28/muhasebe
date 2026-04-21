import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";
import { toDateInputValue } from "./helpers";

const itemSchema = z.object({
  description: z.string().min(2, "Kalem aciklamasi zorunludur."),
  quantity: z.string().min(1, "Miktar zorunludur."),
  unitPrice: z.string().min(1, "Birim fiyat zorunludur."),
  vatRate: z.string().min(1, "KDV orani zorunludur."),
});

const schema = z.object({
  invoiceNumber: z.string().min(3, "Fatura numarasi zorunludur."),
  currentAccount: z.string().min(1, "Cari seciniz."),
  issueDate: z.string().min(1, "Duzenlenme tarihi zorunludur."),
  dueDate: z.string().min(1, "Vade tarihi zorunludur."),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

const createItem = (item) => ({
  description: item?.description || "",
  quantity: item?.quantity ? String(item.quantity) : "1",
  unitPrice: item?.unitPrice ? String(item.unitPrice) : "",
  vatRate: item?.vatRate ? String(item.vatRate) : "20",
});

export const InvoiceForm = ({
  initialValues,
  currents,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceNumber: initialValues?.invoiceNumber || "",
      currentAccount: initialValues?.currentAccount?._id || initialValues?.currentAccount || "",
      issueDate: toDateInputValue(initialValues?.issueDate) || toDateInputValue(new Date()),
      dueDate: toDateInputValue(initialValues?.dueDate) || toDateInputValue(new Date()),
      notes: initialValues?.notes || "",
      items: initialValues?.items?.length ? initialValues.items.map(createItem) : [createItem()],
    },
  });

  const items = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Fatura numarasi" error={form.formState.errors.invoiceNumber?.message}>
          <Input {...form.register("invoiceNumber")} placeholder="FTR-2026-004" />
        </FieldGroup>

        <FieldGroup label="Cari hesap" error={form.formState.errors.currentAccount?.message}>
          <Select {...form.register("currentAccount")}>
            <option value="">Seciniz</option>
            {currents.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Duzenlenme tarihi" error={form.formState.errors.issueDate?.message}>
          <Input {...form.register("issueDate")} type="date" />
        </FieldGroup>

        <FieldGroup label="Vade tarihi" error={form.formState.errors.dueDate?.message}>
          <Input {...form.register("dueDate")} type="date" />
        </FieldGroup>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-heading text-lg font-bold text-ink">Fatura kalemleri</h4>
            <p className="text-sm text-muted">Ara toplam ve KDV hesaplari backend tarafinda otomatik uretilir.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" icon={Plus} onClick={() => items.append(createItem())}>
            Kalem Ekle
          </Button>
        </div>

        <div className="space-y-4">
          {items.fields.map((field, index) => (
            <div key={field.id} className="rounded-[24px] bg-white p-4 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-ink">Kalem {index + 1}</p>
                {items.fields.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => items.remove(index)}
                  >
                    Sil
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 lg:grid-cols-[2fr_repeat(3,1fr)]">
                <FieldGroup
                  label="Aciklama"
                  error={form.formState.errors.items?.[index]?.description?.message}
                >
                  <Input {...form.register(`items.${index}.description`)} />
                </FieldGroup>
                <FieldGroup
                  label="Miktar"
                  error={form.formState.errors.items?.[index]?.quantity?.message}
                >
                  <Input {...form.register(`items.${index}.quantity`)} type="number" min="1" />
                </FieldGroup>
                <FieldGroup
                  label="Birim fiyat"
                  error={form.formState.errors.items?.[index]?.unitPrice?.message}
                >
                  <Input {...form.register(`items.${index}.unitPrice`)} type="number" min="0" step="0.01" />
                </FieldGroup>
                <FieldGroup
                  label="KDV %"
                  error={form.formState.errors.items?.[index]?.vatRate?.message}
                >
                  <Input {...form.register(`items.${index}.vatRate`)} type="number" min="0" step="1" />
                </FieldGroup>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FieldGroup label="Notlar">
        <Textarea {...form.register("notes")} className="min-h-[120px]" />
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Faturayi Kaydet"}
        </Button>
      </div>
    </form>
  );
};

