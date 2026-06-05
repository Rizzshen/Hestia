import * as service from "../services/ingredientsService.js";

export const getIngredient = async (req, res) => {
  const ingredients = await service.getIngredientsByProductId(req.params.id);
  res.json(ingredients);
};

export const addIngredient = async (req, res) => {
  const ingredient = await service.addIngredient(req.params.id, req.body);
  if (!ingredient)
    return res.status(400).json({ error: "Raw Material not found" });
  res.status(201).json(ingredient);
};

export const updateIngredient = async (req, res) => {
  const update = await service.updateIngredient(
    req.params.ingredientId,
    req.body,
  );
  if (!update) return res.status(404).json({ error: "Ingredient not found" });
  res.json(update);
};

export const deleteIngredient = async (req, res) => {
  const removed = await service.removeIngredient(req.params.ingredientId);
  if (!removed) return res.status(404).json({ error: "ingredient not found" });
  res.status(204).send();
};
