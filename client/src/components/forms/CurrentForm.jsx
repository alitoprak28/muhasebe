import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  currentTypeOptions,
  userStatusOptions,
} from "../../constants/options";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";

const schema = z.object({
  type: z.string().min(1, "Cari tipi seciniz."),
  name: z.string().min(2, "Ad zorunludur."),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  identityNumber: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().min(1, "Durum seciniz."),
});

export const CurrentForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initialValues?.type || "customer",
      name: initialValues?.name || "",
      phone: initialValues?.phone || "",
      email: initialValues?.email || "",
      address: initialValues?.address || "",
      taxNumber: initialValues?.taxNumber || "",
      identityNumber: initialValues?.identityNumber || "",
      notes: initialValues?.notes || "",
      status: initialValues?.status || "active",
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Cari tipi" error={form.formState.errors.type?.message}>
          <Select {...form.register("type")}>
            {currentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Firma / Kisi adi" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} placeholder="Orn. Marmara Teknoloji A.S." />
        </FieldGroup>

        <FieldGroup label="Telefon">
          <Input {...form.register("phone")} placeholder="+90 212 000 00 00" />
        </FieldGroup>

        <FieldGroup label="E-posta">
          <Input {...form.register("email")} type="email" placeholder="ornek@firma.com" />
        </FieldGroup>

        <FieldGroup label="Vergi no">
          <Input {...form.register("taxNumber")} />
        </FieldGroup>

        <FieldGroup label="Kimlik no">
          <Input {...form.register("identityNumber")} />
        </FieldGroup>

        <FieldGroup label="Durum">
          <Select {...form.register("status")}>
            {userStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>
      </div>

      <FieldGroup label="Adres">
        <Textarea {...form.register("address")} className="min-h-[90px]" />
      </FieldGroup>

      <FieldGroup label="Notlar">
        <Textarea {...form.register("notes")} className="min-h-[110px]" />
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Cariyi Kaydet"}
        </Button>
      </div>
    </form>
  );
};

