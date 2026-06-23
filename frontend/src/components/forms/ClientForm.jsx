import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";
import { CURRENCIES } from "../../constants";
import { clientSchema } from "../../schemas/client";

export default function ClientForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
  error,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: defaultValues || {
      contact_name: "",
      company_name: "",
      email: "",
      currency: "",
      country: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Contact Name</label>
        <input
          {...register("contact_name")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {errors.contact_name && (
          <p className="text-xs text-danger mt-1">{errors.contact_name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Company Name</label>
        <input
          {...register("company_name")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {errors.company_name && (
          <p className="text-xs text-danger mt-1">{errors.company_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Email</label>
        <input
            type="email"
          {...register("email")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm resize-none"
        />
        {errors.email && (
          <p className="text-xs text-danger mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Country
          </label>
          <input
            {...register("country")}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface-secondary"
          />
          {errors.country && (
            <p className="text-xs text-danger mt-1">{errors.country.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Currency
          </label>
          <select
            {...register("currency")}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
          >
            <option value="">Select currency</option>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.currency && (
            <p className="text-xs text-danger mt-1">{errors.currency.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        {error && (
          <p className="text-xs text-danger mr-auto self-center">
            Failed to save Client. Please try again.
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-text-secondary rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add Client"}
        </Button>
      </div>
    </form>
  );
}