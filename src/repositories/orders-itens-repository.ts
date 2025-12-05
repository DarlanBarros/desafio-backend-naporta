import type { Prisma } from "@prisma/client";

interface OrderItemResponse {
  description: string;
  price: number;
}

export interface OrdersItensRepository {
  create(data: Prisma.OrderItemUncheckedCreateInput): Promise<void>;
  findManyByOrderId(orderId: string): Promise<OrderItemResponse[]>;
}
