import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../../api/dashboard";
import StatCard from "../../components/ui/StatCard";
export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardMetrics,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Total Clients" value={data.total_clients} />
      <StatCard
        label="Confirmed Orders"
        value={
          data.orders_by_status.find((o) => o.status === "confirmed")?.count ||
          0
        }
      />
      <StatCard
        label="Low Stock Items"
        value={data.low_stock_materials.length}
      />
    </div>
  );
}
