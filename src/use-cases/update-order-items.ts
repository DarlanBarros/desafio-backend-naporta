import type { OrdersItemsRepository } from "@/repositories/orders-items-repository.js";

interface UpdateOrderItemRequest {
  description?: string;
  price?: number;
  quantity?: number;
}

export class UpdateOrderItemsUseCase {
  constructor(private ordersItemsRepository: OrdersItemsRepository) {}

  async execute(itemId: string, data: UpdateOrderItemRequest): Promise<void> {
    const orderItem = await this.ordersItemsRepository.findOneById(itemId);

    if (!orderItem) {
      throw new Error("Item doesnt found");
    }

    await this.ordersItemsRepository.update(itemId, data);
  }
}
