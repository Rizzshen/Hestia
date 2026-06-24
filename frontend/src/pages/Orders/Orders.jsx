import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ordersApi from "../../api/orders";
import * as orderItemsApi from "../../api/orderItems";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../../components/forms/OrderForm";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";
import SearchInput from "../../components/ui/SearchInput";
import { useDebounce } from "../../hooks/useDebounce";
import { useSortableData } from "../../hooks/useSortableData";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Trash2, Eye } from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";

import { ORDER_STATUSES, ORDER_STATUS_COLORS } from "../../constants";

function OrdersSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-6 bg-background px-5 py-2.5 gap-4">
        {["w-12", "w-24", "w-20", "w-16", "w-20", "w-8"].map((w, i) => (
          <Skeleton key={i} className={`h-2.5 ${w}`} />
        ))}
      </div>
      <div className="divide-y bg-surface divide-border">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 items-center px-5 py-2.5 gap-4"
          >
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
            <Skeleton className="h-4 w-10 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Orders() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toasts, addToast, removeToast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getOrders,
  });

  // Search
  const searchedData = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearchTerm) return data;
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.id.toString().includes(lowercasedTerm) ||
        (item.contact_name &&
          item.contact_name.toLowerCase().includes(lowercasedTerm)),
    );
  }, [data, debouncedSearchTerm]);

  // Sort & Paginate
  const { sortedData, sortKey, direction, toggleSort } = useSortableData(
    searchedData,
    null,
  );
  const { paginatedData, page, totalPages, goToPage } = usePagination(
    sortedData,
    10,
  );

  // --- MUTATIONS ---

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const { items, ...orderData } = formData;
      const createdOrder = await ordersApi.createOrder(orderData);
      if (items && items.length > 0) {
        await Promise.all(
          items.map((item) =>
            orderItemsApi.addOrderItem(createdOrder.id, item),
          ),
        );
      }
      return createdOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsModalOpen(false);
      addToast("Order created successfully.", "created");
    },
    onError: () => {
      addToast("Failed to create order. Please try again.", "error");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order status updated.", "updated");
    },
    onError: () => {
      addToast(
        "Failed to update status. Only pending orders can be confirmed.",
        "error",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ordersApi.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addToast(`Order #${orderToDelete?.id} deleted.`, "deleted");
      setOrderToDelete(null);
    },
    onError: () => {
      addToast("Only pending orders can be deleted.", "error");
      setOrderToDelete(null);
    },
  });

  // --- HANDLERS ---

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === "confirmed") {
      setOrderToConfirm({ id: orderId, status: newStatus });
      return;
    }
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const handleDelete = (order) => setOrderToDelete(order);

  const confirmDelete = () => {
    deleteMutation.mutate(orderToDelete.id);
  };

  return (
    <PageWrapper>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Order # or Client..."
        />
        <Button onClick={() => setIsModalOpen(true)}>+ Create Order</Button>
      </div>

      {/* Result Count */}
      {searchTerm && searchedData.length > 0 && (
        <p className="text-sm text-text-muted mb-4">
          Found {searchedData.length}{" "}
          {searchedData.length === 1 ? "result" : "results"} for "{searchTerm}"
        </p>
      )}

      {isLoading ? (
        <OrdersSkeleton />
      ) : error ? (
        <ScreenState type="error" onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <ScreenState
          type="empty"
          title="No orders yet"
          description="Create your first order to get started."
        />
      ) : searchedData.length === 0 ? (
        <ScreenState
          type="no-results"
          title="No results found"
          description={`No orders match "${searchTerm}".`}
          action={{ label: "Clear search", onClick: () => setSearchTerm("") }}
        />
      ) : (
        <Table
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              goToPage={goToPage}
              totalItems={sortedData.length}
              pageSize={10}
            />
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead
                sortKey="id"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Order #
              </TableHead>
              <TableHead
                sortKey="contact_name"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Client
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                sortKey="created_at"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
                align="right"
              >
                Date
              </TableHead>
              <TableHead align="right" className="w-px"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.contact_name || "Unknown Client"}</TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={updateStatusMutation.isPending}
                    className={`text-xs font-medium rounded-full border px-2.5 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${ORDER_STATUS_COLORS[order.status]}`}
                  >
                    {ORDER_STATUSES.filter((s) => s !== "shipped").map(
                      (status) => (
                        <option key={status} value={status}>
                          {status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ),
                    )}
                  </select>
                </TableCell>
                <TableCell align="right" className="text-text-muted text-sm">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-1 text-text-muted hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(order)}
                      disabled={order.status !== "pending"}
                      className={`p-1 transition-colors ${
                        order.status !== "pending"
                          ? "text-text-muted/30 cursor-not-allowed"
                          : "text-text-muted hover:text-danger"
                      }`}
                      title={
                        order.status !== "pending"
                          ? "Only pending orders can be deleted"
                          : "Delete"
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
        dismissable={false}
      >
        <OrderForm
          onSubmit={(formData) => createMutation.mutate(formData)}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createMutation.isPending}
          error={createMutation.error}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete Order #${orderToDelete?.id}? This cannot be undone. Note: only pending orders can be deleted.`}
        isLoading={deleteMutation.isPending}
      />

      {/* Confirm Order Dialog */}
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
