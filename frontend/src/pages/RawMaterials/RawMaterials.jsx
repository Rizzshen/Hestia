import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as rawMaterial from "../../api/rawmaterials";
import { useState } from "react";
import RawMaterialForm from "../../components/forms/RawMaterialForm";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";
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

function RawMaterialsSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-5 bg-background px-5 py-3 gap-4">
        {["w-12", "w-8", "w-20", "w-28", "w-12"].map((w, i) => (
          <Skeleton key={i} className={`h-2.5 ${w}`} />
        ))}
      </div>
      <div className="divide-y bg-primary-foreground divide-border">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center px-5 py-3.5 gap-4"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-3 w-10 ml-auto" />
            <Skeleton className="h-3 w-10 ml-auto" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RawMaterials() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["rawMaterials"],
    queryFn: rawMaterial.getRawMaterials,
  });

  const createMutation = useMutation({
    mutationFn: rawMaterial.createRawMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] });
      setIsModalOpen(false);
    },
  });

  return (
    <PageWrapper>
      {/* Action bar — button only, title comes from Topbar */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsModalOpen(true)}>+ Add Raw Material</Button>
      </div>

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead align="right">Stock Qty</TableHead>
              <TableHead align="right">Low Stock Threshold</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium text-text">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Raw Material"
      >
        <RawMaterialForm
          onSubmit={(formData) => createMutation.mutate(formData)}
          isSubmitting={createMutation.isPending}
          onCancel={() => setIsModalOpen(false)}
          error={createMutation.error}
        />
      </Modal>
    </PageWrapper>
  );
}
