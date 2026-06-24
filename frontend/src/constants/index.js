export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export const CURRENCIES = ["USD", "EUR", "NPR", "INR", "CNY"];

export const LOW_STOCK_COLOR = "text-red-500";

export const ORDER_STATUS_VARIANTS = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "neutral",
  delivered: "success",
};

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-gray-50 text-gray-700 border-gray-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

export const UNITS = ["kg", "g", "lb", "oz", "l", "ml", "pcs"];