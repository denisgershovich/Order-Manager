import { type FC } from "react";

import { type Order as OrderType } from "../types/api.types";
import ChangeOrderStatus from "./ChangeOrderStatus";
import { orderStatusToColor } from "@/utils";

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
      <div className="flex flex-col gap-2">
        <span>
          <strong>Title:</strong> {title}
        </span>

        <span style={{ color: orderStatusToColor[status] }}>
          <strong className="text-black">Status:</strong> {status}
        </span>

        <span>
          <strong>Order Time:</strong>
          <time> {new Date(orderTime).toLocaleString()}</time>
        </span>
      </div>

      <ChangeOrderStatus currentStatus={status} id={id} />
    </li>
  );
};

export default Order;
