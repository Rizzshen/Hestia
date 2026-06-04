import pool from '../config/db.js';

export const getAllRawMaterials = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM raw_materials ORDER BY name ASC'
  );
  return rows;
};

export const getRawMaterialById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM raw_materials WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
};

export const createRawMaterial = async ({ name, unit, stock_qty, low_stock_threshold }) => {
  const { rows } = await pool.query(
    `INSERT INTO raw_materials (name, unit, stock_qty, low_stock_threshold)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, unit, stock_qty ?? 0, low_stock_threshold ?? 0]
  );
  return rows[0];
};

export const updateRawMaterial = async (id, fields) => {
  const { name, unit, stock_qty, low_stock_threshold } = fields;
  const { rows } = await pool.query(
    `UPDATE raw_materials
     SET name = $1, unit = $2, stock_qty = $3, low_stock_threshold = $4
     WHERE id = $5
     RETURNING *`,
    [name, unit, stock_qty, low_stock_threshold, id]
  );
  return rows[0] ?? null;
};

export const deleteRawMaterial = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM raw_materials WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] ?? null;
};