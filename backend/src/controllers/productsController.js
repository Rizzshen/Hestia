import * as productsService from '../services/productsService.js';

export const getAll = async (req, res) => {
  const products = await productsService.getProducts();
  res.json(products);
}

export const getOne = async (req, res) => {
    const product = await productsService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
}

export const create = async (req, res) => {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
}

export const update = async (req, res) => {
    const product = await productsService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
}

export const remove = async (req, res) => {
    const product = await productsService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
};