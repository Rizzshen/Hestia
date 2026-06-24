import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import Button from "../ui/Button";
import * as clientsApi from "../../api/clients";
import * as productsApi from "../../api/products";
import { z } from "zod";

const orderHeaderSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  notes: z.string().optional(),
});

export default function OrderForm({
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
    resolver: zodResolver(orderHeaderSchema),
    defaultValues: defaultValues || {
      client_id: "",
      notes: "",
    },
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.getClients,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getProducts,
  });

  const [items, setItems] = useState(
    defaultValues?.items?.length > 0
      ? defaultValues.items
      : [{ product_id: "", quantity: 1, unit_price: "" }]
  );

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1, unit_price: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill unit_price when product is selected
    if (field === "product_id" && productsData) {
      const selectedProduct = productsData.find(p => p.id.toString() === value);
      if (selectedProduct && !newItems[index].unit_price) {
        newItems[index].unit_price = selectedProduct.unit_price;
      }
    }
    
    setItems(newItems);
  };

  const onFormSubmit = (data) => {
    const validItems = items
      .filter((item) => item.product_id && item.quantity > 0)
      .map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price_at_time: parseFloat(item.unit_price) || 0
      }));
    
    onSubmit({ ...data, items: validItems });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* TOP SECTION: Header */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Client</label>
          <select
            {...register("client_id")}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
            disabled={clientsLoading}
          >
            <option value="">Select client</option>
            {clientsData?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.contact_name} {client.company_name ? `(${client.company_name})` : ""}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="text-xs text-danger mt-1">{errors.client_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">Notes (Optional)</label>
          <textarea
            {...register("notes")}
            rows="3"
            className="w-full border border-border rounded-md px-3 py-2 text-sm resize-none"
            placeholder="Any special instructions..."
          />
        </div>
      </div>

      {/* BOTTOM SECTION: Line Items */}
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-text">Line Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Product
                </label>
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(index, "product_id", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
                  disabled={productsLoading}
                >
                  <option value="">Select product</option>
                  {productsData?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-24">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value) || 0)
                  }
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
                />
              </div>

              <div className="w-32">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Unit Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(index, "unit_price", e.target.value)
                  }
                  placeholder="0.00"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-surface"
                />
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-text-muted hover:text-danger transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <p className="text-xs text-text-muted text-center py-2">
              No items added yet.
            </p>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        {error && (
          <p className="text-xs text-danger mr-auto self-center">
            Failed to save Order. Please try again.
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
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create Order"}
        </Button>
      </div>
    </form>
  );
}