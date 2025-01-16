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
      <h6 className="font-semibold">Order Items:</h6>

      <ul>
        {subItems.map((subItem, index) => (
          <li
            key={index}
            className="border-b py-2 flex justify-between items-center px-2">
            <div className="flex flex-col">
              <span className="font-semibold">{subItem.title}</span>
              <span className="text-sm text-gray-500">{subItem.type}</span>
            </div>

            <div className="flex items-center gap-2">
              Amount: {subItem.amount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItems;
