import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userStatusOptions } from "../../constants/options";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";

const cashSchema = z.object({
  name: z.string().min(2, "Hesap adi zorunludur."),
  code: z.string().min(2, "Kod zorunludur."),
  currency: z.string().min(3).max(3),
  description: z.string().optional(),
  isDefault: z.boolean().optional(),
  status: z.string().min(1),
});

const bankSchema = z.object({
  bankName: z.string().min(2, "Banka adi zorunludur."),
  accountName: z.string().min(2, "Hesap sahibi zorunludur."),
  iban: z.string().min(10, "IBAN zorunludur."),
  accountNumber: z.string().optional(),
  branchCode: z.string().optional(),
  currency: z.string().min(3).max(3),
  status: z.string().min(1),
});

export const CashAccountForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const form = useForm({
    resolver: zodResolver(cashSchema),
    defaultValues: {
      name: initialValues?.name || "",
      code: initialValues?.code || "",
      currency: initialValues?.currency || "TRY",
      description: initialValues?.description || "",
      isDefault: Boolean(initialValues?.isDefault),
      status: initialValues?.status || "active",
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Kasa adi" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} placeholder="Merkez Kasa" />
        </FieldGroup>
        <FieldGroup label="Kasa kodu" error={form.formState.errors.code?.message}>
          <Input {...form.register("code")} placeholder="KASA-003" />
        </FieldGroup>
        <FieldGroup label="Para birimi">
          <Input {...form.register("currency")} maxLength={3} />
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
      <FieldGroup label="Aciklama">
        <Textarea {...form.register("description")} className="min-h-[100px]" />
      </FieldGroup>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
        <input type="checkbox" {...form.register("isDefault")} />
        <span className="text-sm text-ink">Varsayilan kasa olarak kullan</span>
      </label>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Kasayi Kaydet"}
        </Button>
      </div>
    </form>
  );
};

export const BankAccountForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const form = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankName: initialValues?.bankName || "",
      accountName: initialValues?.accountName || "",
      iban: initialValues?.iban || "",
      accountNumber: initialValues?.accountNumber || "",
      branchCode: initialValues?.branchCode || "",
      currency: initialValues?.currency || "TRY",
      status: initialValues?.status || "active",
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Banka adi" error={form.formState.errors.bankName?.message}>
          <Input {...form.register("bankName")} placeholder="Akbank" />
        </FieldGroup>
        <FieldGroup label="Hesap adi" error={form.formState.errors.accountName?.message}>
          <Input {...form.register("accountName")} placeholder="NovaFin Ana Hesap" />
        </FieldGroup>
        <FieldGroup label="IBAN" error={form.formState.errors.iban?.message}>
          <Input {...form.register("iban")} placeholder="TR00 0000 0000 0000 0000 0000 00" />
        </FieldGroup>
        <FieldGroup label="Hesap numarasi">
          <Input {...form.register("accountNumber")} />
        </FieldGroup>
        <FieldGroup label="Sube kodu">
          <Input {...form.register("branchCode")} />
        </FieldGroup>
        <FieldGroup label="Para birimi">
          <Input {...form.register("currency")} maxLength={3} />
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
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Banka Hesabini Kaydet"}
        </Button>
      </div>
    </form>
  );
};

