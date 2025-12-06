/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import { randomUUID } from "node:crypto";
import type { OrderItem, Prisma } from "@prisma/client";
import { Decimal } from "decimal.js";
import type {
  OrderItemResponse,
  OrdersItemsRepository,
} from "../orders-items-repository.js";

export class InMemoryOrdersItemsRepository implements OrdersItemsRepository {
  items: OrderItem[] = [];

  async create(data: Prisma.OrderItemUncheckedCreateInput): Promise<void> {
    const orderItem: OrderItem = {
      id: randomUUID(),
      description: data.description,
      price: new Decimal(data.price.toString()),
      quantity: data.quantity,
      orderId: data.orderId,
    };

    this.items.push(orderItem);
  }

  async update(itemId: string, data: Partial<OrderItem>): Promise<void> {
    const orderItem = this.items.find((item) => item.id === itemId);

    if (!orderItem) {
      throw new Error("orderItem not found");
    }

    Object.assign(orderItem, data);
  }

  async delete(itemId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  async deleteAll(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.orderId !== id);
  }

  async findOneById(itemId: string): Promise<OrderItem | null> {
    const orderItem = this.items.find((item) => item.id === itemId);

    if (!orderItem) {
      return null;
    }

    return orderItem;
  }

  async findManyByOrderId(orderId: string): Promise<OrderItemResponse[]> {
    const ordersItemsResponse: OrderItemResponse[] = [];
    const orderItems = this.items.filter((item) => item.orderId === orderId);

    orderItems.map((item) =>
      ordersItemsResponse.push({
        description: item.description,
        price: item.price.toNumber(),
      })
    );

    return ordersItemsResponse;
  }
}
