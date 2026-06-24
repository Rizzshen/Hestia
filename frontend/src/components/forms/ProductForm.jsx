import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import Button from "../ui/Button";
import { CURRENCIES } from "../../constants";
import { productSchema } from "../../schemas/product";
import * as rawMaterialsApi from "../../api/rawMaterials";

export default function ProductForm({
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
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      unit_price: 0,
      currency: "",
      stock_qty: 0,
    },
  });

  const { data: rawMaterials } = useQuery({
    queryKey: ["rawMaterials"],
    queryFn: rawMaterialsApi.getRawMaterials,
  });

  const [ingredients, setIngredients] = useState(() => {
    return defaultValues?.ingredients || [];
  });

  
  const prevProductIdRef = useRef();

  useEffect(() => {
    const currentProductId = defaultValues?.id;
    
    // Only update ingredients when switching to a different product
    if (currentProductId && currentProductId !== prevProductIdRef.current) {
      setIngredients(defaultValues.ingredients || []);
      prevProductIdRef.current = currentProductId;
    }
  }, [defaultValues]); 

  const addIngredient = () => {
    setIngredients([...ingredients, { raw_material_id: "", quantity_needed: 1 }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const onFormSubmit = (data) => {
    const formattedIngredients = ingredients
      .filter((ing) => ing.raw_material_id && ing.quantity_needed > 0)
      .map((ing) => ({
        raw_material_id: parseInt(ing.raw_material_id),
        quantity_needed: parseFloat(ing.quantity_needed),
      }));

    onSubmit({ ...data, ingredients: formattedIngredients });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Name</label>
          <input {...register("name")} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">Description</label>
          <textarea {...register("description")} rows={3} className="w-full border border-border rounded-md px-3 py-2 text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Unit Price</label>
            <input type="number" step="0.01" {...register("unit_price")} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface-secondary" />
            {errors.unit_price && <p className="text-xs text-danger mt-1">{errors.unit_price.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Currency</label>
            <select {...register("currency")} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface">
              <option value="">Select currency</option>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Stock Quantity</label>
          <input type="number" {...register("stock_qty")} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface-secondary" />
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-text">Ingredients (Recipe)</h3>
          <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            <Plus size={14} /> Add Ingredient
          </button>
        </div>

        <div className="space-y-3">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1">Raw Material</label>
                <select
                  value={ing.raw_material_id}
                  onChange={(e) => updateIngredient(index, "raw_material_id", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
                >
                  <option value="">Select material</option>
                  {rawMaterials?.map((mat) => (
                    <option key={mat.id} value={mat.id}>{mat.name} ({mat.unit})</option>
                  ))}
                </select>
              </div>

              <div className="w-32">
                <label className="block text-xs font-medium text-text-secondary mb-1">Qty Needed</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ing.quantity_needed}
                  onChange={(e) => updateIngredient(index, "quantity_needed", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
                />
              </div>

              <div className="pt-5">
                <button type="button" onClick={() => removeIngredient(index)} className="p-2 text-text-muted hover:text-danger transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {ingredients.length === 0 && (
            <p className="text-xs text-text-muted text-center py-2">No ingredients added yet.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        {error && <p className="text-xs text-danger mr-auto self-center">Failed to save product.</p>}
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-text-secondary rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50">
          Cancel
        </button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}