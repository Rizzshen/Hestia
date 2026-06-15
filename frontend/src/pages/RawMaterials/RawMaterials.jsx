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

export default function RawMaterials() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rawMaterials"],
    queryFn: rawMaterial.getRawMaterials,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;
  if (!data) return <p>No data</p>;

  return (
    <PageWrapper title="Raw Materials">
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
    </PageWrapper>
  );
}
