import type { Order, Prisma } from "@prisma/client";
import type { ListOrdersRequest } from "@/use-cases/list-orders.js";

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>;
  findManyByFilter(filter: ListOrdersRequest): Promise<Order[]>;
}
