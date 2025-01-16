import fs from "fs";

import { faker } from "@faker-js/faker";

import { type Order, SubItem, OrderStatus } from "./models/order";
import { pizzaNames, pizzaTypes } from "./constants";

const saveOrdersToFile = (orders: Order[]): void => {
  try {
    const ordersJson = JSON.stringify(orders, null, 2);
    fs.writeFileSync(ORDERS_FILE_PATH, ordersJson, "utf-8");
  } catch (error) {
    console.error("Error saving orders to file:", error);
  }
};

const loadOrdersFromFile = () => {
  const data = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
  const savedOrders = JSON.parse(data);

  orders.push(...savedOrders);
};

const orders: Order[] = [];

const createFakeOrders = (): void => {
  const orderStatus = Object.values(OrderStatus);

  for (let i = 0; i < ORDERS_NUMBER; i++) {
    const title = faker.helpers.arrayElement(pizzaNames);
    const location = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    };

    const orderTime = faker.date.recent();
    const status = faker.helpers.arrayElement(orderStatus);
    const subItems = generateSubItems();

    const order: Order = {
      id: i + 1,
      title,
      location,
      orderTime,
      status,
      subItems,
      updatedAt: null,
    };

    orders.push(order);
  }

  saveOrdersToFile(orders);
};

const generateSubItems = (): SubItem[] => {
  const subItems: SubItem[] = [];
  const numberOfSubItems = faker.number.int({ min: 1, max: 5 });

  for (let i = 0; i < numberOfSubItems; i++) {
    subItems.push({
      title: faker.commerce.productName(),
      amount: faker.number.int({ min: 1, max: 5 }),
      type: faker.helpers.arrayElement(pizzaTypes),
    });
  }

  return subItems;
};

const ORDERS_NUMBER = 300;
const ORDERS_FILE_PATH = process.env.ORDERS_FILE_PATH || "./orders.json";

if (!fs.existsSync(ORDERS_FILE_PATH)) createFakeOrders();

loadOrdersFromFile();

export { orders, saveOrdersToFile };
