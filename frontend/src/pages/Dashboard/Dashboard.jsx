import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../../api/dashboard";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ORDER_STATUS_VARIANTS } from "../../constants";
import PageWrapper from "../../components/layout/PageWrapper";

import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
 
      {/* Recent orders */}
      <Card>
        <Skeleton className="h-3 w-28 mb-5" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
 
      {/* Low stock */}
      <Card>
        <Skeleton className="h-3 w-28 mb-5" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
export default function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardMetrics,
  });

  return (
    <PageWrapper title="Dashboard">
      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ScreenState type="error" onRetry={refetch} />
      ) : !data ? (
        <ScreenState type="empty" title="No dashboard data" />
      ) : (
        
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
                {console.log(order)}
                <span className="text-text">{order.company_name || order.contact_name || "Unknown Client"}</span>
                <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          {data.low_stock_materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-text-muted text-sm">
              All materials sufficiently stocked
            </div>
          ) : (
            data.low_stock_materials.map((material) => (
              <div
                key={material.id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-text">{material.name}</span>
                <span className="text-text-muted">
                  {material.stock_qty} {material.unit} /{" "}
                  {material.low_stock_threshold} {material.unit}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>
      )}
    </PageWrapper>
  );
}
