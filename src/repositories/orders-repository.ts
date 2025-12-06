import type { Order, OrderStatus, Prisma } from "@prisma/client";

export type OrdersFilter = Partial<{
  orderNumber: string;
  status: OrderStatus;
  startDate: Date;
  endDate: Date;
}>;

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>;
  update(orderId: string, data: Prisma.OrderUpdateInput): Promise<Order>;
  delete(orderId: string): Promise<void>;
  findManyByFilter(filter: OrdersFilter): Promise<Order[]>;
  findOneById(orderId: string): Promise<Order | null>;
}
