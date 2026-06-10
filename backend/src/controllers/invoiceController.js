import * as service from "../services/invoiceService.js";

export const invoice = async (req, res) => {
  try {
    const data = await service.generateInvoices(req.params.orderId);
    if (!data) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
