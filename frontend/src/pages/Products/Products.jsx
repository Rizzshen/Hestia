import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as products from "../../api/products";
import { useState, useMemo } from "react";
import ProductForm from "../../components/forms/ProductForm";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";
import { useSortableData } from "../../hooks/useSortableData";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableUnitBadge,
} from "../../components/ui/Table";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import Tooltip from "../../components/ui/Tooltip";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInput from "../../components/ui/SearchInput";

function ProductsSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-6 bg-background px-5 py-2.5 gap-4">
        {["w-12", "w-8", "w-20", "w-28", "w-12", "w-8"].map((w, i) => (
          <Skeleton key={i} className={`h-2.5 ${w}`} />
        ))}
      </div>
      <div className="divide-y bg-surface divide-border">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 items-center px-5 py-2.5 gap-4"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-3 w-10 ml-auto" />
            <Skeleton className="h-3 w-10 ml-auto" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-4 w-10 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  //Search State
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toasts, addToast, removeToast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: products.getProducts,
  });
  const searchedData = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearchTerm) return data;

    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercasedTerm) ||
        (item.description &&
          item.description.toLowerCase().includes(lowercasedTerm)) ||
        (item.currency && item.currency.toLowerCase().includes(lowercasedTerm)),
    );
  }, [data, debouncedSearchTerm]);
  const { sortedData, sortKey, direction, toggleSort } = useSortableData(
    searchedData,
    null,
  );
  const { paginatedData, page, totalPages, goToPage } = usePagination(
    sortedData,
    10,
  );

  const createMutation = useMutation({
    mutationFn: products.createProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      addToast(`"${variables.name}" added successfully.`, "created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => products.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      addToast(`"${variables.data.name}" updated.`, "updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: products.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addToast(`"${productToDelete?.name}" deleted.`, "deleted");
    },
  });

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(productToDelete.id, {
      onSuccess: () => setProductToDelete(null),
    });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search Products..."
        />
        <Button onClick={() => setIsModalOpen(true)}>+ Add Products</Button>
      </div>
      {/* Show result count ABOVE the table, only if there are results */}
      {searchTerm && searchedData.length > 0 && (
        <p className="text-sm text-text-muted mb-4">
          Found {searchedData.length}{" "}
          {searchedData.length === 1 ? "result" : "results"} for "{searchTerm}"
        </p>
      )}
      {isLoading ? (
        <ProductsSkeleton />
      ) : error ? (
        <ScreenState type="error" onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <ScreenState
          type="empty"
          title="No products yet"
          description="Add your first product to get started."
        />
      ) : searchedData.length === 0 ? (
        // 2. Search Empty State (Database has items, but search found 0)
        <ScreenState
          type="empty"
          title="No results found"
          description={`No products match "${searchTerm}". Try a different search.`}
          onRetry={() => setSearchTerm("")}
          retryLabel="Clear Search"
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
                sortKey="name"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Name
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                sortKey="unit_price"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
                align="right"
              >
                Unit Price
              </TableHead>
              <TableHead
                sortKey="currency"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Currency
              </TableHead>
              <TableHead
                sortKey="stock_qty"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
                align="right"
              >
                Stock Qty
              </TableHead>
              <TableHead align="right" className="w-px"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-text-muted truncate max-w-xs">
                  {product.description ? (
                    <Tooltip content={product.description}>
                      <span className="truncate block max-w-xs">
                        {product.description}
                      </span>
                    </Tooltip>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(product.unit_price).toFixed(2)}
                </TableCell>
                <TableCell>
                  <TableUnitBadge>{product.currency}</TableUnitBadge>
                </TableCell>
                <TableCell align="right">{product.stock_qty}</TableCell>
                <TableCell align="right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-1 text-text-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-1 text-text-muted hover:text-danger transition-colors"
                      title="Delete"
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

      <Modal
        isOpen={isModalOpen || !!editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Add Product"}
        dismissable={false}
      >
        <ProductForm
          defaultValues={editingProduct}
          isEditing={!!editingProduct}
          onSubmit={(formData) => {
            if (editingProduct) {
              updateMutation.mutate({ id: editingProduct.id, data: formData });
            } else {
              createMutation.mutate(formData);
            }
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          error={createMutation.error || updateMutation.error}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  );
}
