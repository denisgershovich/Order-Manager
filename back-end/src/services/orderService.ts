import { orders, saveOrdersToFile } from "../orderGenerator";

import { OrderStatus } from "../models/order";

const getPaginatedOrders = (page: number, limit: number, filter: string) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const filteredOrders =
    filter === "notDelivered"
      ? orders.filter((order) => order.status !== OrderStatus.Delivered)
      : orders;

  const results = filteredOrders.slice(startIndex, endIndex);
  const totalCount = filteredOrders.length;

  return { results, totalCount };
};

const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
  const order = orders.find((order) => String(order.id) === id);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = newStatus;
  order.updatedAt = new Date();

  saveOrdersToFile(orders);

  return order;
};

export { getPaginatedOrders, updateOrderStatus };
