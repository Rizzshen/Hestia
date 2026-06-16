import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery } from "@tanstack/react-query";
import * as rawMaterial from "../../api/rawmaterials";
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

import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";

function RawMaterialsSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-background px-5 py-3">
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="divide-y divide-border">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-5 py-3.5"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RawMaterials() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["rawMaterials"],
    queryFn: rawMaterial.getRawMaterials,
  });

  return (
    <PageWrapper title="Raw Materials">
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
    </PageWrapper>
  );
}
