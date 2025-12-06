import type { OrdersItemsRepository } from "@/repositories/orders-items-repository.js";
import type { OrdersRepository } from "@/repositories/orders-repository.js";

interface DeleteOrderRequest {
  id: string;
}

export class DeleteOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private orderItemsRepository: OrdersItemsRepository
  ) {}

  async execute({ id }: DeleteOrderRequest): Promise<void> {
    const orderExists = await this.ordersRepository.findOneById(id);

    if (!orderExists) {
      throw new Error("Order doesnt exists");
    }

    await this.orderItemsRepository.deleteAll(id);
    await this.ordersRepository.delete(id);
  }
}
