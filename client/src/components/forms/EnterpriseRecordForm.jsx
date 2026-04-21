import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { FieldGroup, Input, Select, Textarea } from "../common/FormControls";
import { toDateInputValue } from "./helpers";

const normalizeDefaultValue = (field, initialValues = {}) => {
  const value = initialValues[field.name];

  if (field.type === "checkbox") {
    return Boolean(value ?? field.defaultValue);
  }

  if (field.type === "date") {
    return toDateInputValue(value || field.defaultValue);
  }

  if (field.type === "number") {
    return value ?? field.defaultValue ?? "";
  }

  return value ?? field.defaultValue ?? "";
};

const normalizePayload = (fields, values) =>
  fields.reduce((result, field) => {
    const rawValue = values[field.name];

    if (field.serialize) {
      result[field.name] = field.serialize(rawValue, values);
      return result;
    }

    if (field.type === "number") {
      result[field.name] = rawValue === "" ? "" : Number(rawValue);
      return result;
    }

    if (field.type === "checkbox") {
      result[field.name] = Boolean(rawValue);
      return result;
    }

    result[field.name] = rawValue;
    return result;
  }, {});

const renderField = (field, register) => {
  if (field.type === "textarea") {
    return <Textarea {...register(field.name, field.rules)} placeholder={field.placeholder} />;
  }

  if (field.type === "select") {
    return (
      <Select {...register(field.name, field.rules)}>
        <option value="">{field.emptyLabel || "Seciniz"}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink">
        <input type="checkbox" {...register(field.name, field.rules)} />
        <span>{field.checkboxLabel || field.label}</span>
      </label>
    );
  }

  return (
    <Input
      {...register(field.name, field.rules)}
      type={field.type || "text"}
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      step={field.step}
    />
  );
};

export const EnterpriseRecordForm = ({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "Kaydet",
}) => {
  const form = useForm({
    defaultValues: fields.reduce((result, field) => {
      result[field.name] = normalizeDefaultValue(field, initialValues);
      return result;
    }, {}),
  });

  const submitHandler = (values) => onSubmit(normalizePayload(fields, values));

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.className || ""}>
            <FieldGroup
              label={field.type === "checkbox" ? field.groupLabel || field.label : field.label}
              hint={field.hint}
              error={form.formState.errors[field.name]?.message}
            >
              {renderField(field, form.register)}
            </FieldGroup>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgec
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
