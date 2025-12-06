/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import { randomUUID } from "node:crypto";
import type { Order, Prisma } from "@prisma/client";
import type { OrdersFilter, OrdersRepository } from "../orders-repository.js";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async findOneById(orderId: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyByFilter(filter: OrdersFilter): Promise<Order[]> {
    const orders = this.items.filter(
      (order) =>
        (!filter.orderNumber ||
          order.orderNumber.includes(filter.orderNumber)) &&
        (!filter.status || order.status === filter.status) &&
        (!filter.startDate || order.createdAt >= filter.startDate) &&
        (!filter.endDate || order.createdAt <= filter.endDate)
    );

    return orders;
  }

  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const order: Order = {
      id: randomUUID(),
      orderNumber: data.orderNumber,
      customerId: data.customerId,
      status: "PENDING",
      deliveryAddress: data.deliveryAddress,
      estimatedDeliveryDate: new Date(data.estimatedDeliveryDate),
      createdAt: new Date(),
    };

    this.items.push(order);

    return order;
  }

  async update(orderId: string, data: Partial<Order>): Promise<Order> {
    const order = this.items.find((item) => item.id === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    Object.assign(order, data);

    return order;
  }

  async delete(orderId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== orderId);
  }
}
