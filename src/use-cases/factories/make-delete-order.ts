import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository.js";
import { DeleteOrderUseCase } from "../delete-order.js";

export function makeDeleteOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository();
  const useCase = new DeleteOrderUseCase(ordersRepository);

  return useCase;
}
