import type { OrdersItemsRepository } from "@/repositories/orders-items-repository.js";

interface DeleteOrderItemRequest {
  itemId: string;
}

export class DeleteOrderItemsUseCase {
  constructor(private ordersItemsRepository: OrdersItemsRepository) {}

  async execute({ itemId }: DeleteOrderItemRequest): Promise<void> {
    const orderItem = await this.ordersItemsRepository.findOneById(itemId);

    if (!orderItem) {
      throw new Error("Item doesnt found");
    }

    await this.ordersItemsRepository.delete(itemId);
  }
}
