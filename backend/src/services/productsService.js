import pool from "../config/db.js";

export const getProducts = async () => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products ORDER BY name ASC",
    );
    return rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return rows[0] ?? null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async ({
  name,
  description,
  unit_price,
  currency,
  stock_qty,
}) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, unit_price, currency, stock_qty)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, unit_price, currency, stock_qty],
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, fields) => {
  const { name, description, unit_price, currency, stock_qty } = fields;
  try {
    const { rows } = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, unit_price = $3, currency = $4, stock_qty = $5
       WHERE id = $6
       RETURNING *`,
      [name, description, unit_price, currency, stock_qty, id],
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
