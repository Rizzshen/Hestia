import * as service from "../services/orderItemsService.js";

export const addItem = async (req, res) => {
  const item = await service.addItem(req.params.id, req.body);
  if(!item) return res.status(400).json({error: 'Product not found'});
  res.status(201).json(item);
};

export const removeItem = async (req, res) => {
  const item = await service.removeItem(req.params.itemId);
  if (!item) res.status(400).json("{error: 'Item not found'}");
  res.status(204).send();
};

export const getItemsByOrderId = async (req, res) => {
  const items = await service.getItemsByOrderId(req.params.id);
  res.status(200).json(items);
};
