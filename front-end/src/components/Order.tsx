import { type FC } from "react";

import { type Order as OrderType } from "../types/api.types";
import ChangeOrderStatus from "./ChangeOrderStatus";

interface OrderProps
  extends Pick<OrderType, "title" | "orderTime" | "status" | "id"> {
  onOrderClick: () => void;
  className?: string;
}

const Order: FC<OrderProps> = ({
  id,
  title,
  orderTime,
  status,
  onOrderClick,
  className,
}) => {
  return (
    <li onClick={onOrderClick} className={className}>
      <span>
        <strong>Title:</strong> {title}
      </span>

      <span className="flex gap-2 items-center justify-between  w-full">
        <strong>Status: {status}</strong>

        <ChangeOrderStatus currentStatus={status} id={id} />
      </span>

      <span>
        <strong>Order Time:</strong> {new Date(orderTime).toLocaleString()}
      </span>
    </li>
  );
};

export default Order;
