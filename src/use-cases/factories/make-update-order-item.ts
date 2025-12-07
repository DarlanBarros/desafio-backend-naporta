import { PrismaOrderItemsRepository } from "@/repositories/prisma/prisma-order-items-repository.js";
import { UpdateOrderItemsUseCase } from "../update-order-items.js";

export function makeUpdateOrderItem() {
  const orderItemsRepository = new PrismaOrderItemsRepository();

  const useCase = new UpdateOrderItemsUseCase(orderItemsRepository);

  return useCase;
}
