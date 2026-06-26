import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { getDashboardMetrics } from "../../api/dashboard";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ORDER_STATUS_VARIANTS } from "../../constants";
import PageWrapper from "../../components/layout/PageWrapper";

import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";

// Recharts for the Bar Chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Lucide Icons
import { Users, CheckCircle2, Clock, AlertTriangle, Package } from "lucide-react";

// --- Colors for the Chart (using your theme) ---
const CHART_COLORS = ["#185fa5", "#0c447c", "#475569", "#94a3b8", "#e2e8f0"];

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
 
      {/* 2-Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border p-6 space-y-4">
          <Skeleton className="h-4 w-32 mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border p-6 space-y-4">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardMetrics,
  });

  // Calculate specific order counts
  const confirmedOrders = data?.orders_by_status.find((o) => o.status === "confirmed")?.count || 0;
  const pendingOrders = data?.orders_by_status.find((o) => o.status === "pending" || o.status === "processing")?.count || 0;

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
          
          {/* 1. Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-text">
                Welcome back, {user?.name || "there"}!
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Here's what's happening with your business today.
              </p>
            </div>
          </div>

          {/* 2. KPI Stat Cards (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Clients" value={data.total_clients} />
            <StatCard label="Confirmed Orders" value={confirmedOrders} />
            <StatCard label="Pending Orders" value={pendingOrders} />
            <StatCard label="Low Stock Alerts" value={data.low_stock_materials.length} />
          </div>

          {/* 3. Main 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Recent Orders (Takes up 2/3) */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Recent Orders
                  </h2>
                  <span className="text-xs text-text-muted">Last 5 orders</span>
                </div>
                
                <div className="space-y-0 divide-y divide-border">
                  {data.recent_orders.length === 0 ? (
                    <p className="text-sm text-text-muted py-4 text-center">No recent orders</p>
                  ) : (
                    data.recent_orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-light p-2 rounded-md">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text">
                              {order.company_name || order.contact_name || "Unknown Client"}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column: Bar Chart (Takes up 1/3) */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
                  Orders by Status
                </h2>
                
                <div className="h-64 w-full">
                  {data.orders_by_status.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-text-muted text-sm">
                      No data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.orders_by_status} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                        <XAxis 
                          dataKey="status" 
                          tick={{ fill: '#64748b', fontSize: 11 }} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <YAxis 
                          tick={{ fill: '#64748b', fontSize: 11 }} 
                          axisLine={false} 
                          tickLine={false} 
                          allowDecimals={false}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(24, 95, 165, 0.05)' }} 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '8px',
                            fontSize: '12px'
                          }} 
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {data.orders_by_status.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* 4. Bottom Section: Low Stock Alerts */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Low Stock Alerts
              </h2>
            </div>

            {data.low_stock_materials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-text-muted text-sm bg-surface-secondary/30 rounded-lg border border-dashed border-border">
                <CheckCircle2 className="h-5 w-5 text-success mb-2" />
                All materials are sufficiently stocked
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.low_stock_materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between items-center p-3 rounded-lg border border-danger-border/30 bg-danger-bg/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-text">{material.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">Threshold: {material.low_stock_threshold} {material.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-danger">{material.stock_qty}</p>
                      <p className="text-xs text-text-muted">{material.unit} left</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      )}
    </PageWrapper>
  );
}