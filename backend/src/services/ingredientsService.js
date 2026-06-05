import pool from "../config/db.js";

export const getIngredientsByProductId = async (productId) => {
  const rows = await pool.query(
    "SELECT * from product_ingredients  INNER JOIN raw_materials ON product_ingredients.raw_material_id = raw_materials.id WHERE product_id=$1",
    [productId],
  );
  return rows;
};

export const addIngredient = async (
  productId,
  { raw_material_id, quantity_needed },
) => {
    const { rows: existing } = await pool.query('SELECT id from raw_materials WHERE id = $1', [raw_material_id]);
    if (!existing[0]) return null;
    const {rows} = await pool.query(`INSERT INTO product_ingredients (product_id, raw_material_id, quantity_needed) VALUES ($1, $2, $3) RETURNING *`,[productId, raw_material_id, quantity_needed]);
    return rows[0] ?? null;
    
};

export const updateIngredient = async (ingredientID, { quantity_needed }) => {
  const {rows} = await pool.query(
    `UPDATE product_ingredients SET quantity_needed = $1 WHERE id = $2 RETURNING *`,
    [quantity_needed, ingredientID],
  );
  return rows[0] ?? null;
};

export const removeIngredient = async (ingredientID) => {
  const {rows} = await pool.query("DELETE FROM product_ingredients WHERE id=$1 RETURNING *", [
    ingredientID,
  ]);
  return rows[0] ?? null;
};
