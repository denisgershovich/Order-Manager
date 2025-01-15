export enum OrderStatus {
  Received = "Received",
  Preparing = "Preparing",
  Ready = "Ready",
  EnRoute = "In Route",
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
  status: OrderStatus;
  subItems: SubItem[];
  updatedAt: Date;
}

export interface PaginatedResponse {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
  results: Order[];
}
