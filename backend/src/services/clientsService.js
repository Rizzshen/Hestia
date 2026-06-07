import pool from "../config/db.js";

export const viewClients = async () => {
  const { rows } = await pool.query("SELECT * FROM clients ORDER BY company_name ASC");
  return rows;
};

export const addClients = async ({
  company_name,
  contact_name,
  email,
  country,
  currency}
) => {
  const { rows } = await pool.query(
    `INSERT INTO clients (company_name, contact_name, email, country, currency) Values ($1, $2, $3, $4, $5) RETURNING *`,
    [company_name, contact_name, email, country, currency],
  );
  return rows[0];
};

export const updateClients = async (id, fields) => {
  const { company_name, contact_name, email, country, currency } = fields;
  const { rows } = await pool.query(
    `UPDATE clients SET company_name =$1, contact_name = $2, email = $3, country = $4, currency = $5 WHERE id = $6 RETURNING *`,
    [company_name, contact_name, email, country, currency, id],
  );
  return rows[0] ?? null;
};

export const deleteClients = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM clients WHERE id = $1 RETURNING *",[id]
  );
  return rows[0] ?? null;
};

export const getClientById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
  return rows[0] ?? null;
};
