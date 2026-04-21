import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  accountModelOptions,
  incomeCategoryOptions,
  paymentMethodOptions,
} from "../../constants/options";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";
import { accountOptionsByModel, toDateInputValue } from "./helpers";

const schema = z.object({
  title: z.string().min(3, "Baslik en az 3 karakter olmali."),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori seciniz."),
  amount: z.string().min(1, "Tutar zorunludur."),
  date: z.string().min(1, "Tarih zorunludur."),
  paymentMethod: z.string().min(1, "Odeme yontemi seciniz."),
  currentAccount: z.string().optional(),
  documentNumber: z.string().optional(),
  accountModel: z.string().min(1, "Hesap tipi seciniz."),
  account: z.string().min(1, "Hesap seciniz."),
});

export const IncomeForm = ({
  initialValues,
  currents,
  cashAccounts,
  bankAccounts,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      category: initialValues?.category || "service_sale",
      amount: initialValues?.amount ? String(initialValues.amount) : "",
      date: toDateInputValue(initialValues?.date) || toDateInputValue(new Date()),
      paymentMethod: initialValues?.paymentMethod || "bank_transfer",
      currentAccount: initialValues?.currentAccount?._id || initialValues?.currentAccount || "",
      documentNumber: initialValues?.documentNumber || "",
      accountModel: initialValues?.accountModel || "BankAccount",
      account: initialValues?.account?._id || initialValues?.account || "",
    },
  });

  const selectedAccountModel = form.watch("accountModel");
  const accountOptions = useMemo(
    () => accountOptionsByModel(selectedAccountModel, cashAccounts, bankAccounts),
    [bankAccounts, cashAccounts, selectedAccountModel]
  );

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Gelir basligi" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} placeholder="Orn. Kurumsal abonelik tahsilati" />
        </FieldGroup>

        <FieldGroup label="Kategori" error={form.formState.errors.category?.message}>
          <Select {...form.register("category")}>
            {incomeCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Tutar" error={form.formState.errors.amount?.message}>
          <Input {...form.register("amount")} type="number" min="0" step="0.01" />
        </FieldGroup>

        <FieldGroup label="Tarih" error={form.formState.errors.date?.message}>
          <Input {...form.register("date")} type="date" />
        </FieldGroup>

        <FieldGroup label="Odeme yontemi" error={form.formState.errors.paymentMethod?.message}>
          <Select {...form.register("paymentMethod")}>
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Cari hesap">
          <Select {...form.register("currentAccount")}>
            <option value="">Seciniz</option>
            {currents.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Hesap tipi" error={form.formState.errors.accountModel?.message}>
          <Select {...form.register("accountModel")}>
            {accountModelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Hesap secimi" error={form.formState.errors.account?.message}>
          <Select {...form.register("account")}>
            <option value="">Seciniz</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Belge / Fatura No">
          <Input {...form.register("documentNumber")} placeholder="GLR-2026-009" />
        </FieldGroup>
      </div>

      <FieldGroup label="Aciklama">
        <Textarea {...form.register("description")} placeholder="Kayitla ilgili aciklayici notlar..." />
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Kaydi Tamamla"}
        </Button>
      </div>
    </form>
  );
};

