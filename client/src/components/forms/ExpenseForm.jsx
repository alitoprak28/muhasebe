import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  accountModelOptions,
  expenseCategoryOptions,
  expenseStatusOptions,
  paymentMethodOptions,
} from "../../constants/options";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";
import { accountOptionsByModel, toDateInputValue } from "./helpers";

const schema = z
  .object({
    title: z.string().min(3, "Baslik en az 3 karakter olmali."),
    description: z.string().optional(),
    category: z.string().min(1, "Kategori seciniz."),
    amount: z.string().min(1, "Tutar zorunludur."),
    date: z.string().min(1, "Tarih zorunludur."),
    dueDate: z.string().optional(),
    paymentMethod: z.string().min(1, "Odeme yontemi seciniz."),
    currentAccount: z.string().optional(),
    receiptNumber: z.string().optional(),
    status: z.string().min(1, "Durum seciniz."),
    isRecurring: z.boolean().optional(),
    recurrenceRule: z.string().optional(),
    accountModel: z.string().optional(),
    account: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.status === "paid" && (!value.accountModel || !value.account)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["account"],
        message: "Odenmis giderler icin hesap secimi zorunludur.",
      });
    }
  });

export const ExpenseForm = ({
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
      category: initialValues?.category || "software",
      amount: initialValues?.amount ? String(initialValues.amount) : "",
      date: toDateInputValue(initialValues?.date) || toDateInputValue(new Date()),
      dueDate: toDateInputValue(initialValues?.dueDate) || "",
      paymentMethod: initialValues?.paymentMethod || "bank_transfer",
      currentAccount: initialValues?.currentAccount?._id || initialValues?.currentAccount || "",
      receiptNumber: initialValues?.receiptNumber || "",
      status: initialValues?.status || "paid",
      isRecurring: Boolean(initialValues?.isRecurring),
      recurrenceRule: initialValues?.recurrenceRule || "",
      accountModel: initialValues?.accountModel || "BankAccount",
      account: initialValues?.account?._id || initialValues?.account || "",
    },
  });

  const selectedAccountModel = form.watch("accountModel");
  const selectedStatus = form.watch("status");
  const accountOptions = useMemo(
    () => accountOptionsByModel(selectedAccountModel, cashAccounts, bankAccounts),
    [bankAccounts, cashAccounts, selectedAccountModel]
  );

  const submitHandler = (values) => {
    const normalizedValues = { ...values };

    if (normalizedValues.status !== "paid") {
      normalizedValues.accountModel = undefined;
      normalizedValues.account = undefined;
    }

    return onSubmit(normalizedValues);
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(submitHandler)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Gider basligi" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} placeholder="Orn. Bulut altyapi faturasi" />
        </FieldGroup>

        <FieldGroup label="Kategori" error={form.formState.errors.category?.message}>
          <Select {...form.register("category")}>
            {expenseCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Tutar" error={form.formState.errors.amount?.message}>
          <Input {...form.register("amount")} type="number" min="0" step="0.01" />
        </FieldGroup>

        <FieldGroup label="Islem tarihi" error={form.formState.errors.date?.message}>
          <Input {...form.register("date")} type="date" />
        </FieldGroup>

        <FieldGroup label="Vade tarihi">
          <Input {...form.register("dueDate")} type="date" />
        </FieldGroup>

        <FieldGroup label="Durum" error={form.formState.errors.status?.message}>
          <Select {...form.register("status")}>
            {expenseStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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

        <FieldGroup label="Tedarikci / Cari">
          <Select {...form.register("currentAccount")}>
            <option value="">Seciniz</option>
            {currents.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Fis / Fatura No">
          <Input {...form.register("receiptNumber")} placeholder="GDR-2026-009" />
        </FieldGroup>

        <FieldGroup label="Hesap tipi">
          <Select {...form.register("accountModel")} disabled={selectedStatus !== "paid"}>
            <option value="">Seciniz</option>
            {accountModelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup label="Hesap secimi">
          <Select {...form.register("account")} disabled={selectedStatus !== "paid"}>
            <option value="">Seciniz</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>
      </div>

      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        <FieldGroup label="Tekrarlayan gider">
          <label className="flex h-[52px] items-center gap-3 rounded-2xl border border-slate-200 px-4">
            <input type="checkbox" {...form.register("isRecurring")} />
            <span className="text-sm text-ink">Bu kayit gelecekte tekrar edebilir</span>
          </label>
        </FieldGroup>

        <FieldGroup label="Tekrarlama notu">
          <Input
            {...form.register("recurrenceRule")}
            placeholder="Orn. Aylik / her ayin ilk haftasi"
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Aciklama">
        <Textarea {...form.register("description")} placeholder="Gider detay notlari..." />
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
