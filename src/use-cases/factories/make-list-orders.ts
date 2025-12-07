import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository.js";
import { PrismaOrderItemsRepository } from "@/repositories/prisma/prisma-order-items-repository.js";
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository.js";
import { ListOrdersUseCase } from "../list-orders.js";

export function makeListOrdersUseCase() {
  const ordersRepository = new PrismaOrdersRepository();
  const orderItemsRepository = new PrismaOrderItemsRepository();
  const customersRepository = new PrismaCustomersRepository();

  const useCase = new ListOrdersUseCase(
    ordersRepository,
    customersRepository,
    orderItemsRepository
  );

  return useCase;
}
