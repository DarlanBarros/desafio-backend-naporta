import { PrismaOrderItemsRepository } from "@/repositories/prisma/prisma-order-items-repository.js";
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository.js";
import { CreateOrderItemsUseCase } from "../create-order-item.js";

export function makeCreateOrderItem() {
  const ordersRepository = new PrismaOrdersRepository();
  const orderItemsRepository = new PrismaOrderItemsRepository();

  const useCase = new CreateOrderItemsUseCase(
    orderItemsRepository,
    ordersRepository
  );

  return useCase;
}
