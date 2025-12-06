import type { OrderItem, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type {
  OrderItemResponse,
  OrdersItemsRepository,
} from "../orders-items-repository.js";

export class PrismaOrderItemsRepository implements OrdersItemsRepository {
  async create(data: Prisma.OrderItemUncheckedCreateInput): Promise<void> {
    await prisma.orderItem.create({ data });
  }

  async update(
    itemId: string,
    data: Prisma.OrderItemUpdateInput
  ): Promise<void> {
    await prisma.orderItem.update({
      where: {
        id: itemId,
      },
      data,
    });
  }

  async delete(itemId: string): Promise<void> {
    await prisma.orderItem.delete({
      where: {
        id: itemId,
      },
    });
  }

  async deleteAll(id: string): Promise<void> {
    await prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });
  }

  async findOneById(itemId: string): Promise<OrderItem | null> {
    const orderItem = await prisma.orderItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!orderItem) {
      return null;
    }

    return orderItem;
  }

  async findManyByOrderId(orderId: string): Promise<OrderItemResponse[]> {
    const orderItems = await prisma.$queryRaw<OrderItemResponse[]>`
            SELECT descricao, preco
            FROM itens_pedido
            WHERE pedido_id = ${orderId}
        `;

    return orderItems;
  }
}
