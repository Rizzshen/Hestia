import pool from "../config/db.js";

export const getItemsByOrderId = async (orderId) => {
  const { rows } = await pool.query(
    `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity,oi.unit_price_at_time,  p.name AS product_name FROM order_items oi INNER JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1`,
    [orderId],
  );
  return rows;
};

export const addItem = async (orderId, { product_id, quantity }) => {
  const { rows: product } = await pool.query(
    `SELECT * FROM products WHERE id = $1`,
    [product_id],
  );
  if (!product[0]) return null;
  const { rows } = await pool.query(
    `INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_time) VALUES($1, $2, $3, $4) RETURNING *`,
    [orderId, product_id, quantity, product[0].unit_price],
  );
  return rows[0] ?? null;
};

export const removeItem = async (itemID) => {
  const { rows } = await pool.query(
    "DELETE FROM order_items WHERE id = $1 RETURNING *",
    [itemID],
  );
  return rows[0] ?? null;
};
