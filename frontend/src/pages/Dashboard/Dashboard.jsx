import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../../api/dashboard";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ORDER_STATUS_VARIANTS } from "../../constants";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardMetrics,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Clients" value={data.total_clients} />
        <StatCard
          label="Confirmed Orders"
          value={
            data.orders_by_status.find((o) => o.status === "confirmed")
              ?.count || 0
          }
        />
        <StatCard
          label="Low Stock Items"
          value={data.low_stock_materials.length}
        />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-text-secondary mb-4">
          RECENT ORDERS
        </h2>
        <div className="space-y-3">
          {data.recent_orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-text">{order.company_name}</span>
              <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>{order.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        {data.low_stock_materials.length === 0? <p>No Stock</p>: data.low_stock_materials.map((material)=>(
          <div key={material.name} className="flex justify-between items-center text-sm">
            <span className="text-text">{material.name}</span>
          <span className="text-text-muted">
            {material.stock_qty} {material.unit} / {material.low_stock_threshold} {material.unit}
          </span>
          </div>
          
        ))}
      </Card>
    </div>
  );
}
