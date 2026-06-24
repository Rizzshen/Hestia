import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as ordersApi from "../../api/orders";
import * as orderItemsApi from "../../api/orderItems";
import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  ArrowLeft,
  Printer,
  Package,
  User,
  Calendar,
  DollarSign,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { ORDER_STATUSES, ORDER_STATUS_COLORS } from "../../constants";
import { formatCurrency } from "../../lib/formatters";

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-6 space-y-4">
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
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toasts, addToast, removeToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState(null);

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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order status updated.", "updated");
    },
    onError: () => {
      addToast("Failed to update status.", "error");
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async () => {
      const invoiceData = await ordersApi.generateOrderInvoice(id);
      const pdfResponse = await fetch(invoiceData.pdf_url);
      if (!pdfResponse.ok) throw new Error("Failed to download PDF");
      return await pdfResponse.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-Order-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast("Invoice downloaded successfully.", "created");
    },
    onError: () => {
      addToast("Failed to generate invoice.", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast(`Order #${id} deleted.`, "deleted");
      navigate("/orders");
    },
    onError: () => {
      addToast("Failed to delete order.", "error");
    },
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus === "confirmed") {
      setOrderToConfirm({ id, status: newStatus });
      return;
    }
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  if (orderLoading || itemsLoading)
    return (
      <PageWrapper>
        <OrderDetailSkeleton />
      </PageWrapper>
    );
  if (orderError || itemsError)
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
  if (!order)
    return (
      <PageWrapper>
        <ScreenState type="empty" title="Order not found" />
      </PageWrapper>
    );

  const subtotal =
    items?.reduce((acc, item) => {
      const price = item.unit_price_at_time || item.unit_price || 0;
      const qty = item.quantity || 0;
      return acc + price * qty;
    }, 0) || 0;

  const total = order.total_amount || subtotal;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text">
                Order #{order.id}
              </h1>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updateStatusMutation.isPending}
                className={`text-sm font-medium px-3 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${ORDER_STATUS_COLORS[order.status]}`}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-text-muted mt-1">
              Created{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "Unknown date"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => generateInvoiceMutation.mutate()}
            disabled={generateInvoiceMutation.isPending}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            Invoice
          </Button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteMutation.isPending || order.status !== "pending"}
            className={`p-2 rounded-lg transition-colors ${
              order.status !== "pending"
                ? "text-gray-300 cursor-not-allowed"
                : "text-text-muted hover:text-danger hover:bg-red-50"
            }`}
            title={
              order.status !== "pending"
                ? "Only pending orders can be deleted"
                : "Delete Order"
            }
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Line Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items Card */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-background flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Line Items
              </h2>
              <span className="text-sm text-text-muted">
                {items?.length || 0} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background/50 text-xs uppercase text-text-muted">
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
                        <tr
                          key={item.id}
                          className="hover:bg-background/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-text">
                            {item.product_name || `Product #${item.product_id}`}
                          </td>
                          <td className="px-6 py-4 text-right text-text-muted">
                            {qty}
                          </td>
                          <td className="px-6 py-4 text-right text-text-muted">
                            {formatCurrency(unitPrice, order.currency)}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-text">
                            {formatCurrency(lineTotal, order.currency)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-text-muted"
                      >
                        No items in this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Card */}
          {order.notes && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-sm font-medium text-text-muted uppercase mb-3">
                Order Notes
              </h3>
              <p className="text-sm text-text bg-background/50 p-4 rounded-lg border border-border">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-text-muted uppercase mb-4 flex items-center gap-2">
              <DollarSign size={16} />
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium text-text">
                  {formatCurrency(subtotal, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Tax (0%)</span>
                <span className="font-medium text-text">
                  {formatCurrency(0, order.currency)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="font-semibold text-text">Total</span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(total, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-text-muted uppercase mb-4 flex items-center gap-2">
              <User size={16} />
              Client Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted uppercase mb-1">
                  Contact Name
                </p>
                <p className="font-medium text-text">
                  {order.contact_name || "—"}
                </p>
              </div>
              {order.company_name && (
                <div>
                  <p className="text-xs text-text-muted uppercase mb-1">
                    Company
                  </p>
                  <p className="font-medium text-text">{order.company_name}</p>
                </div>
              )}
              {order.email && (
                <div>
                  <p className="text-xs text-text-muted uppercase mb-1">
                    Email
                  </p>
                  <p className="text-sm text-text">{order.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-text-muted uppercase mb-4 flex items-center gap-2">
              <Calendar size={16} />
              Order Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted uppercase mb-1">
                  Order ID
                </p>
                <p className="font-mono text-sm text-text">#{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase mb-1">
                  Created At
                </p>
                <p className="text-sm text-text">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase mb-1">Status</p>
                <p className="text-sm text-text capitalize">
                  {order.status.replace("_", " ")}
                </p>
              </div>
            </div>
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

      <ConfirmDialog
        isOpen={!!orderToConfirm}
        onClose={() => setOrderToConfirm(null)}
        onConfirm={() => {
          updateStatusMutation.mutate(orderToConfirm);
          setOrderToConfirm(null);
        }}
        title="Confirm Order"
        description="Confirming this order will permanently deduct raw materials from stock. This cannot be undone."
        confirmLabel="Confirm Order"
        isLoading={updateStatusMutation.isPending}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  );
}