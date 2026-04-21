import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  userRoleOptions,
  userStatusOptions,
} from "../../constants/options";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select } from "../common/FormControls";

const schema = z.object({
  name: z.string().min(3, "Ad soyad zorunludur."),
  email: z.string().email("Gecerli e-posta giriniz."),
  password: z.string().min(6, "Parola en az 6 karakter olmali."),
  role: z.string().min(1, "Rol seciniz."),
  status: z.string().min(1, "Durum seciniz."),
});

export const UserForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "viewer",
      status: "active",
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Ad soyad" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </FieldGroup>
        <FieldGroup label="E-posta" error={form.formState.errors.email?.message}>
          <Input {...form.register("email")} type="email" />
        </FieldGroup>
        <FieldGroup label="Parola" error={form.formState.errors.password?.message}>
          <Input {...form.register("password")} type="password" />
        </FieldGroup>
        <FieldGroup label="Rol" error={form.formState.errors.role?.message}>
          <Select {...form.register("role")}>
            {userRoleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup label="Durum" error={form.formState.errors.status?.message}>
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
          {isSubmitting ? "Kaydediliyor..." : "Kullaniciyi Kaydet"}
        </Button>
      </div>
    </form>
  );
};

