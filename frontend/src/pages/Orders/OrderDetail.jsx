import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as ordersApi from "../../api/orders";
import * as orderItemsApi from "../../api/orderItems";
import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { ArrowLeft, Trash2, Printer } from "lucide-react";
import { useState } from "react";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";

const getStatusColors = (status) => {
  const colors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toasts, addToast, removeToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["orderItems", id],
    queryFn: () => orderItemsApi.getOrderItems(id),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      addToast("Order status updated.", "updated");
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async () => {
      const invoiceData = await ordersApi.generateOrderInvoice(id);
      const pdfResponse = await fetch(invoiceData.pdf_url);
      if (!pdfResponse.ok)
        throw new Error("Failed to download PDF from storage");
      return await pdfResponse.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-Order-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast("Invoice downloaded successfully.", "created");
    },
    onError: (error) => {
      console.error(error);
      addToast("Failed to generate or download invoice.", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => ordersApi.deleteOrder(id),
    onSuccess: () => {
      addToast(`Order #${id} deleted.`, "deleted");
      navigate("/orders");
    },
  });

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  if (orderLoading || itemsLoading)
    return (
      <PageWrapper>
        <OrderDetailSkeleton />
      </PageWrapper>
    );

  if (orderError || itemsError) {
    return (
      <PageWrapper>
        <ScreenState
          type="error"
          onRetry={() =>
            queryClient.invalidateQueries({ queryKey: ["order", id] })
          }
        />
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <ScreenState type="empty" title="Order not found" />
      </PageWrapper>
    );
  }

  // Calculate totals - use unit_price_at_time OR unit_price depending on what backend returns
  const subtotal =
    items?.reduce((acc, item) => {
      const price = item.unit_price_at_time || item.unit_price || 0;
      const qty = item.quantity || 0;
      return acc + price * qty;
    }, 0) || 0;

  const total = order.total_amount || subtotal;

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 text-text-muted hover:text-text hover:bg-surface-secondary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text">Order #{order.id}</h1>
            <p className="text-sm text-text-muted">
              Created{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "Unknown date"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updateStatusMutation.isPending}
            className={`px-3 py-1.5 text-sm font-medium rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${getStatusColors(
              order.status,
            )}`}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => generateInvoiceMutation.mutate()}
            disabled={generateInvoiceMutation.isPending}
            className="p-2 text-text-muted hover:text-text hover:bg-surface-secondary rounded-lg transition-colors disabled:opacity-50"
            title="Download Invoice"
          >
            <Printer size={20} />
          </button>

          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 size={16} className="mr-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background">
            <h2 className="text-lg font-semibold text-text">Line Items</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background text-text-muted text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Product</th>
                  <th className="px-6 py-3 text-right font-medium">Qty</th>
                  <th className="px-6 py-3 text-right font-medium">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items && items.length > 0 ? (
                  items.map((item) => {
                    const unitPrice =
                      item.unit_price_at_time || item.unit_price || 0;
                    const qty = item.quantity || 0;
                    const lineTotal = unitPrice * qty;

                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 font-medium text-text">
                          {item.product_name || `Product #${item.product_id}`}
                        </td>
                        <td className="px-6 py-4 text-right text-text-muted">
                          {qty}
                        </td>
                        <td className="px-6 py-4 text-right text-text-muted">
                          {unitPrice
                            ? `$${parseFloat(unitPrice).toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-text">
                          {lineTotal
                            ? `$${parseFloat(lineTotal).toFixed(2)}`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-text-muted"
                    >
                      No items in this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-text-muted uppercase mb-4">
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium text-text">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-text">Total</span>
                <span className="font-bold text-lg text-primary">
                  ${parseFloat(total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-text-muted uppercase mb-1">
                Client
              </h3>
              <p className="font-medium text-text">
                {console.log(order)}
                {order.contact_name || "Unknown Contact"}
                {order.company_name && (
                  <span className="text-text-muted font-normal ml-1">
                    ({order.company_name})
                  </span>
                )}
              </p>
            </div>

            {order.notes && (
              <div>
                <h3 className="text-sm font-medium text-text-muted uppercase mb-1">
                  Notes
                </h3>
                <p className="text-sm text-text bg-background p-3 rounded-md border border-border whitespace-pre-wrap">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Order"
        description={`Are you sure you want to permanently delete Order #${order.id}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  );
}
