import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as rawMaterial from "../../api/rawmaterials";
import { useState, useMemo } from "react";
import RawMaterialForm from "../../components/forms/RawMaterialForm";
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
  TableStatusBadge,
} from "../../components/ui/Table";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInput from "../../components/ui/SearchInput";

function RawMaterialsSkeleton() {
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

export default function RawMaterials() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  //Search State
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { toasts, addToast, removeToast } = useToast();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["rawMaterials"],
    queryFn: rawMaterial.getRawMaterials,
  });

  const searchedData = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearchTerm) return data;
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercasedTerm) ||
        item.unit.toLowerCase().includes(lowercasedTerm),
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
    mutationFn: rawMaterial.createRawMaterial,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] });
      setIsModalOpen(false);
      addToast(`"${variables.name}" added successfully.`, "created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => rawMaterial.updateRawMaterial(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] });
      setIsModalOpen(false);
      addToast(`"${variables.data.name}" updated.`, "updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: rawMaterial.deleteRawMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] });
      addToast(`"${materialToDelete?.name}" deleted.`, "deleted");
    },
  });

  const handleDelete = (material) => {
    setMaterialToDelete(material);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(materialToDelete.id, {
      onSuccess: () => setMaterialToDelete(null),
    });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search materials..."
        />
        <Button onClick={() => setIsModalOpen(true)}>+ Add Raw Material</Button>
      </div>
      {/* Show result count ABOVE the table, only if there are results */}
      {searchTerm && searchedData.length > 0 && (
        <p className="text-sm text-text-muted mb-4">
          Found {searchedData.length}{" "}
          {searchedData.length === 1 ? "result" : "results"} for "{searchTerm}"
        </p>
      )}

      {isLoading ? (
        <RawMaterialsSkeleton />
      ) : error ? (
        <ScreenState type="error" onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <ScreenState
          type="empty"
          title="No raw materials yet"
          description="Add your first raw material to get started."
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
              <TableHead
                sortKey="unit"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Unit
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
              <TableHead
                sortKey="low_stock_threshold"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
                align="right"
              >
                Low Stock Threshold
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right" className="w-px"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium capitalize">
                  {material.name}
                </TableCell>
                <TableCell>
                  <TableUnitBadge>{material.unit}</TableUnitBadge>
                </TableCell>
                <TableCell align="right">{material.stock_qty}</TableCell>
                <TableCell align="right">
                  {material.low_stock_threshold}
                </TableCell>
                <TableCell>
                  <TableStatusBadge
                    qty={material.stock_qty}
                    threshold={material.low_stock_threshold}
                  />
                </TableCell>
                <TableCell align="right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingMaterial(material)}
                      className="p-1 text-text-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(material)}
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
        isOpen={isModalOpen || !!editingMaterial}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMaterial(null);
        }}
        title={editingMaterial ? "Edit Raw Material" : "Add Raw Material"}
        dismissable={false}
      >
        <RawMaterialForm
          defaultValues={editingMaterial}
          isEditing={!!editingMaterial}
          onSubmit={(formData) => {
            if (editingMaterial) {
              updateMutation.mutate({ id: editingMaterial.id, data: formData });
            } else {
              createMutation.mutate(formData);
            }
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingMaterial(null);
          }}
          error={createMutation.error || updateMutation.error}
        />
      </Modal>
      <ConfirmDialog
        isOpen={!!materialToDelete}
        onClose={() => setMaterialToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete raw material"
        description={`Are you sure you want to delete "${materialToDelete?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
      <Toast toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  );
}
