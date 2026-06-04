import * as service from '../services/rawMaterialsService.js';

export const getAll = async (req, res) => {
  const materials = await service.getAllRawMaterials();
  res.json(materials);
};

export const getOne = async (req, res) => {
  const material = await service.getRawMaterialById(req.params.id);
  if (!material) return res.status(404).json({ error: 'Raw material not found' });
  res.json(material);
};

export const create = async (req, res) => {
  const material = await service.createRawMaterial(req.body);
  res.status(201).json(material);
};

export const update = async (req, res) => {
  const material = await service.updateRawMaterial(req.params.id, req.body);
  if (!material) return res.status(404).json({ error: 'Raw material not found' });
  res.json(material);
};

export const remove = async (req, res) => {
  const material = await service.deleteRawMaterial(req.params.id);
  if (!material) return res.status(404).json({ error: 'Raw material not found' });
  res.status(204).send();
};