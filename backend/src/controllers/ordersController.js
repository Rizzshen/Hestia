import * as service from "../services/ordersService.js";

export const  getAllOrders = async(req, res) =>{
    const order = await service.getAllOrders();
    res.status(200).json(order);
}

export const getOrderById = async(req, res) => {
    const order = await service.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);

}

export const createOrder = async(req, res)=> {
    const order = await service.createOrder(req.body);
    res.status(201).json(order);
}

export const updateOrder = async(req, res)=>{
    const order = await service.updateOrderStatus(req.params.id, req.body.status);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);

}

export const deleteOrder = async (req, res) => {
  try {
    const order = await service.deleteOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};