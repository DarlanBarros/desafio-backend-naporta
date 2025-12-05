/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import { randomUUID } from "node:crypto";
import type { Order, Prisma } from "@prisma/client";
import type { ListOrdersRequest } from "@/use-cases/list-orders.js";
import type { OrdersRepository } from "../orders-repository.js";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async findManyByFilter(filter: ListOrdersRequest): Promise<Order[]> {
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
}
