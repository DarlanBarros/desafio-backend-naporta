import { PrismaOrderItemsRepository } from "@/repositories/prisma/prisma-order-items-repository.js";
import { DeleteOrderItemsUseCase } from "../delete-order-item.js";

export function makeDeleteOrderItem() {
  const orderItemsRepository = new PrismaOrderItemsRepository();

  const useCase = new DeleteOrderItemsUseCase(orderItemsRepository);

  return useCase;
}
