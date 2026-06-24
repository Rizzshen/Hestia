import pool from "../config/db.js";

export const getDashboardMetrics = async () => {
  const [ordersByStatus, totalClients, recentOrders, lowStock] =
    await Promise.all([
      pool.query(
        "SELECT status, COUNT(*) as count from orders GROUP BY status",
      ),
      pool.query("SELECT COUNT(*) as count from clients"),
      pool.query(
        `SELECT orders.id, orders.status, orders.created_at, orders.notes, clients.company_name, clients.contact_name
        FROM orders 
        INNER JOIN clients ON orders.client_id = clients.id 
        ORDER BY orders.created_at DESC 
        LIMIT 5`,
      ),
      pool.query(
        "SELECT * from raw_materials WHERE stock_qty < low_stock_threshold",
      ),
    ]);
  return {
    orders_by_status: ordersByStatus.rows,
    total_clients: totalClients.rows[0].count,
    recent_orders: recentOrders.rows,
    low_stock_materials: lowStock.rows,
  };
};
