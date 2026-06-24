import pool from "../config/db.js";

export const getAllOrders = async () => {
  const { rows } = await pool.query(
    "SELECT   orders.*,  clients.company_name, clients.contact_name, clients.currency FROM orders INNER JOIN clients ON clients.id = orders.client_id",
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

export const getOrderById = async (id) => {
  const { rows } = await pool.query(
    `SELECT orders.*, clients.company_name, clients.contact_name, clients.currency, clients.email 
     FROM orders 
     INNER JOIN clients ON clients.id = orders.client_id 
     WHERE orders.id = $1`,
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
  await pool.query("DELETE FROM order_items WHERE order_id = $1", [id]);
  await pool.query("DELETE FROM invoices WHERE order_id = $1", [id]);
  const { rows } = await pool.query(
    "DELETE FROM orders WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0] ?? null;
};

export const updateOrderStatus = async (id, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    if (status === "confirmed") {
      const { rows: items } = await client.query(
        "SELECT * from order_items WHERE order_id = $1",
        [id],
      );
      
      for (const item of items) {
        // 1. DEDUCT THE PRODUCT STOCK (Finished good)
        await client.query(
          "UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2",
          [item.quantity, item.product_id]
        );

        // 2. DEDUCT THE RAW MATERIALS (Ingredients used to make it)
        const { rows: ingredients } = await client.query(
          "SELECT * from product_ingredients WHERE product_id = $1",
          [item.product_id],
        );
        
        for (const ingredient of ingredients) {
          const deduction = ingredient.quantity_needed * item.quantity;
          
          await client.query(
            "UPDATE raw_materials SET stock_qty = stock_qty - $1 WHERE id = $2",
            [deduction, ingredient.raw_material_id], 
          );
        }
      }
    }
    
    const { rows } = await client.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );

    await client.query("COMMIT");
    return rows[0] ?? null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
