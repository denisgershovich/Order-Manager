import fs from "fs";

import { faker } from "@faker-js/faker";

import { type Order, SubItem, OrderStatus } from "./models/order";

const saveOrdersToFile = () => {
  const ordersJson = JSON.stringify(orders, null, 2);
  fs.writeFileSync("./orders.json", ordersJson);
};

const orderStatus = Object.values(OrderStatus);

const pizzaNames = [
  "Margherita Magic",
  "Pepperoni Paradise",
  "Veggie Delight",
  "Supreme Slice",
  "Cheese Lovers' Dream",
  "Mamma's Meat Feast",
  "Spicy Inferno",
  "BBQ Chicken Bonanza",
  "Four Seasons Special",
  "Tuscan Delight",
];

const orders: Order[] = [];

const createFakeOrders = (): void => {
  if (fs.existsSync("./orders.json")) {
    const data = fs.readFileSync("./orders.json", "utf-8");
    const savedOrders = JSON.parse(data);
    orders.push(...savedOrders);

    return;
  }

  for (let i = 0; i < ORDERS_NUMBER; i++) {
    const title = faker.helpers.arrayElement(pizzaNames);
    const location = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    };
    const orderTime = faker.date.recent();
    const status = faker.helpers.arrayElement(orderStatus);
    const subItems = generateSubItems();
    const updatedAt = orderTime;

    const orderData: Order = {
      id: i + 1,
      title,
      location,
      orderTime,
      status,
      subItems,
      updatedAt,
    };

    orders.push(orderData);
  }

  saveOrdersToFile();
};

const generateSubItems = (): SubItem[] => {
  const subItems: SubItem[] = [];
  const numberOfSubItems = faker.number.int({ min: 1, max: 5 });

  for (let i = 0; i < numberOfSubItems; i++) {
    subItems.push({
      title: faker.commerce.productName(),
      amount: faker.number.int({ min: 1, max: 5 }),
      type: faker.helpers.arrayElement([
        "Margherita",
        "Pepperoni",
        "Veggie",
        "Hawaiian",
        "BBQ Chicken",
      ]),
    });
  }

  return subItems;
};

const ORDERS_NUMBER = 300;

createFakeOrders();

export { orders };
