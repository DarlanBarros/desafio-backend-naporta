/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import { randomUUID } from "node:crypto";
import type { OrderItem, Prisma } from "@prisma/client";
import { Decimal } from "decimal.js";
import type { OrdersItensRepository } from "../orders-itens-repository.js";

interface OrderItemResponse {
  description: string;
  price: number;
}

export class InMemoryOrdersItensRepository implements OrdersItensRepository {
  items: OrderItem[] = [];

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
}
