import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rawMaterialSchema } from "../../schemas/rawMaterial";
import Button from "../ui/Button";
import { UNITS } from "../../constants";

export default function RawMaterialForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rawMaterialSchema),
    defaultValues: defaultValues || {
      name: "",
      unit: "",
      stock_qty: 0,
      low_stock_threshold: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Name</label>
        <input
          {...register("name")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Unit</label>
        <select
          {...register("unit")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
        >
          <option value="">Select a unit</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        {errors.unit && (
          <p className="text-xs text-danger mt-1">{errors.unit.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            {...register("stock_qty")}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface-secondary"
          />
          {errors.stock_qty && (
            <p className="text-xs text-danger mt-1">
              {errors.stock_qty.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Low Stock Threshold
          </label>
          <input
            type="number"
            {...register("low_stock_threshold")}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface-secondary"
          />
          {errors.low_stock_threshold && (
            <p className="text-xs text-danger mt-1">
              {errors.low_stock_threshold.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        {error && (
          <p className="text-xs text-danger mr-auto self-center">
            Failed to add material. Please try again.
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
          {isSubmitting ? "Adding..." : "Add material"}
        </Button>
      </div>
    </form>
  );
}
