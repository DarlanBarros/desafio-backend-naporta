import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository.js";
import { PrismaOrderItemsRepository } from "@/repositories/prisma/prisma-order-items-repository.js";
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository.js";
import { CreateOrderUseCase } from "../create-order.js";

export function makeCreateOrder() {
  const ordersRepository = new PrismaOrdersRepository();
  const customersRepository = new PrismaCustomersRepository();
  const orderItemsRepository = new PrismaOrderItemsRepository();

  const useCase = new CreateOrderUseCase(
    customersRepository,
    ordersRepository,
    orderItemsRepository
  );

  return useCase;
}
