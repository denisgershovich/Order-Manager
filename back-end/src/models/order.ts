export enum OrderStatus {
  Received = "Received",
  Preparing = "Preparing",
  Ready = "Ready",
  EnRoute = "EnRoute",
  Delivered = "Delivered",
}

export interface SubItem {
  title: string;
  amount: number;
  type: string;
}

export interface Order {
  id: number;
  title: string;
  location: { lat: number; lng: number };
  orderTime: Date;
  updatedAt: Date;
  status: OrderStatus;
  subItems: SubItem[];
}
