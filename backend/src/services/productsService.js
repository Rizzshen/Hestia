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

export const createProduct = async ({ name, description, unit_price, currency, stock_qty, ingredients }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const { rows } = await client.query(
      `INSERT INTO products (name, description, unit_price, currency, stock_qty) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, unit_price, currency, stock_qty]
    );
    const product = rows[0];

    // If ingredients were sent, add them in the same transaction
    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        await client.query(
          `INSERT INTO product_ingredients (product_id, raw_material_id, quantity_needed) 
           VALUES ($1, $2, $3)`,
          [product.id, ing.raw_material_id, ing.quantity_needed]
        );
      }
    }

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const updateProduct = async (id, { name, description, unit_price, currency, stock_qty, ingredients }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    await client.query(
      `UPDATE products 
       SET name = $1, description = $2, unit_price = $3, currency = $4, stock_qty = $5 
       WHERE id = $6 RETURNING *`,
      [name, description, unit_price, currency, stock_qty, id]
    );

    // Delete old recipe and create new one if ingredients were sent
    if (ingredients) {
      await client.query("DELETE FROM product_ingredients WHERE product_id = $1", [id]);
      for (const ing of ingredients) {
        await client.query(
          `INSERT INTO product_ingredients (product_id, raw_material_id, quantity_needed) 
           VALUES ($1, $2, $3)`,
          [id, ing.raw_material_id, ing.quantity_needed]
        );
      }
    }

    await client.query("COMMIT");
    return { id, name, description, unit_price, currency, stock_qty };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
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
