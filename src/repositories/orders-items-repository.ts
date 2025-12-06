import type { OrderItem, Prisma } from "@prisma/client";

export interface OrderItemResponse {
  description: string;
  price: number;
}

export interface OrdersItemsRepository {
  create(data: Prisma.OrderItemUncheckedCreateInput): Promise<void>;
  update(itemId: string, data: Prisma.OrderItemUpdateInput): Promise<void>;
  delete(itemId: string): Promise<void>;
  deleteAll(id: string): Promise<void>;
  findOneById(itemId: string): Promise<OrderItem | null>;
  findManyByOrderId(orderId: string): Promise<OrderItemResponse[]>;
}
