import type { Order, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { OrdersFilter, OrdersRepository } from "../orders-repository.js";

export class PrismaOrdersRepository implements OrdersRepository {
  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const order = await prisma.order.create({ data });

    return order;
  }

  async update(orderId: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data,
    });

    return order;
  }

  async delete(orderId: string): Promise<void> {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findOneById(orderId: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyByFilter(filter: OrdersFilter): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        ...(filter.orderNumber && {
          orderNumber: {
            contains: filter.orderNumber,
            mode: "insensitive",
          },
        }),

        ...(filter.status && {
          status: filter.status,
        }),

        ...(filter.startDate || filter.endDate
          ? {
              createdAt: {
                ...(filter.startDate && { gte: filter.startDate }),
                ...(filter.endDate && { lte: filter.endDate }),
              },
            }
          : {}),
      },
    });

    return orders;
  }
}
