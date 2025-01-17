import { OrderStatus, type Order } from "./types/api.types";
import { SortKey } from "./types/types";

export const BASE_API_URL =
  process.env.REACT_APP_BASE_API_URL || "http://localhost:3000/api";

export const sortOrders = (orders: Order[], sortKey: SortKey): Order[] => {
  if (!sortKey) return orders;

  return [...orders].sort((a, b) => {
    switch (sortKey) {
      case SortKey.Title:
        return a.title.localeCompare(b.title);
      case SortKey.Status:
        return a.status.localeCompare(b.status);
      case SortKey.OrderTime:
        return (
          new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
        );
      default:
        return 0;
    }
  });
};

export const orderStatusToColor = {
  [OrderStatus.Received]: "#3b82f6",
  [OrderStatus.Preparing]: "#eab308",
  [OrderStatus.Ready]: "#22c55e",
  [OrderStatus.EnRoute]: "#ec4899",
  [OrderStatus.Delivered]: "#34d399",
};

export const statusOptions = Object.entries(OrderStatus);

export const SORT_OPTIONS = Object.entries(SortKey);
