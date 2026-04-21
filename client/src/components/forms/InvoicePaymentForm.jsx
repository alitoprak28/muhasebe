import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  accountModelOptions,
  paymentMethodOptions,
} from "../../constants/options";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";
import { accountOptionsByModel, toDateInputValue } from "./helpers";

const schema = z.object({
  amount: z.string().min(1, "Tutar zorunludur."),
  paymentDate: z.string().min(1, "Tarih zorunludur."),
  paymentMethod: z.string().min(1, "Odeme yontemi seciniz."),
  accountModel: z.string().min(1, "Hesap tipi seciniz."),
  account: z.string().min(1, "Hesap seciniz."),
  note: z.string().optional(),
});

export const InvoicePaymentForm = ({
  invoice,
  cashAccounts,
  bankAccounts,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: invoice?.remainingAmount ? String(invoice.remainingAmount) : "",
      paymentDate: toDateInputValue(new Date()),
      paymentMethod: "bank_transfer",
      accountModel: "BankAccount",
      account: "",
      note: "",
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
        <FieldGroup label="Tahsilat tutari" error={form.formState.errors.amount?.message}>
          <Input {...form.register("amount")} type="number" min="0" step="0.01" />
        </FieldGroup>

        <FieldGroup label="Tahsilat tarihi" error={form.formState.errors.paymentDate?.message}>
          <Input {...form.register("paymentDate")} type="date" />
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
      </div>

      <FieldGroup label="Not">
        <Textarea {...form.register("note")} className="min-h-[100px]" />
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Tahsilati Kaydet"}
        </Button>
      </div>
    </form>
  );
};

