import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository.js";
import { UpdateOrderUseCase } from "../update-order.js";

export function makeUpdateOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository();
  const useCase = new UpdateOrderUseCase(ordersRepository);

  return useCase;
}
