import pool from "../config/db.js";

export const getAllOrders = async () => {
  const { rows } = await pool.query(
    "SELECT   orders.*,  clients.company_name FROM orders INNER JOIN clients ON clients.id = orders.client_id",
  );
  return rows;
};

export const createOrder = async ({ client_id, notes }) => {
  const { rows } = await pool.query(
    `INSERT INTO orders (client_id, notes) VALUES ($1, $2) RETURNING *`,
    [client_id, notes],
  );
  return rows[0];
};

export const updateOrderStatus = async (id, status) => {
  const { rows } = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id],
  );
  return rows[0] ?? null;
};
export const getOrderById = async (id) => {
  const { rows } = await pool.query(
    `SELECT  orders.*,  clients.company_name FROM orders INNER JOIN clients ON clients.id = orders.client_id WHERE orders.id = $1`,
    [id],
  );
  return rows[0] ?? null;
};

export const deleteOrder = async (id) => {
  const { rows: existing } = await pool.query(
    "SELECT status FROM orders WHERE id = $1",
    [id],
  );
  if (!existing[0]) return null;
  if (existing[0].status !== "pending") {
    throw new Error("Only pending orders can be deleted");
  }
  const { rows } = await pool.query(
    "DELETE FROM orders WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0] ?? null;
};
