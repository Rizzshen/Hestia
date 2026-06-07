import * as services from "../services/clientsService.js";

export const getAllclients = async (req, res) => {
  const clients = await services.viewClients();
  res.status(200).json(clients);
};

export const getClientById = async (req, res) => {
  const client = await services.getClientById(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.status(200).json(client);
};

export const addClient = async (req, res) => {
  const client = await services.addClient(req.body);
  res.status(201).json(client);
};

export const updateClient = async (req, res) => {
  const updateClient = await services.updateClient(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Client not found' });
  res.json(updateClient);
};

export const deleteClient = async (req, res) => {
  const deleteClient = await services.deleteClients(req.params.id);
  res.status(204).send(deleteClient);
};
