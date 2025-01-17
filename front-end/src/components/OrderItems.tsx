import clsx from "clsx";

import { type SubItem } from "../types/api.types";
interface OrderItemsProps {
  subItems: SubItem[];
  className?: string
}

const OrderItems: React.FC<OrderItemsProps> = ({ subItems, className }) => {
  if (subItems.length === 0) return <>No Items</>;

  return (
    <div className={clsx(className)}>
      <span className="font-light">Order Items:</span>

      <ul className="flex flex-col gap-2 p-2 rounded-lg">
        {subItems.map((subItem, index) => (
          <li
            key={index}
            className="w-full flex justify-between items-start text-left p-2 rounded-lg shadow">
            <div className="flex flex-col">
              <span className="font-medium">{subItem.title}</span>
              <span className="text-sm text-gray-500">{subItem.type}</span>
            </div>

            <span className="text-md">
              Amount: {subItem.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItems;
