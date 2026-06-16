import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rawMaterialSchema } from "../../schemas/rawMaterial";
import Button from "../ui/Button";

export default function RawMaterialForm({
  defaultValues,
  onSubmit,
  isSubmitting,
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
        <input
          {...register("unit")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {errors.unit && (
          <p className="text-xs text-danger mt-1">{errors.unit.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Stock Quantity
        </label>
        <input
          type="number"
          {...register("stock_qty")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {errors.stock_qty && (
          <p className="text-xs text-danger mt-1">{errors.stock_qty.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Low Stock Threshold
        </label>
        <input
          type="number"
          {...register("low_stock_threshold")}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {errors.low_stock_threshold && (
          <p className="text-xs text-danger mt-1">
            {errors.low_stock_threshold.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
