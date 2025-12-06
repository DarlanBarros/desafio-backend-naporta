import type { OrdersItemsRepository } from "@/repositories/orders-items-repository.js";
import type { OrdersRepository } from "@/repositories/orders-repository.js";

interface CreateOrderItemRequest {
  orderId: string;
  description: string;
  price: number;
  quantity: number;
}

export class CreateOrderItemsUseCase {
  constructor(
    private ordersItemsRepository: OrdersItemsRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({
    orderId,
    description,
    price,
    quantity,
  }: CreateOrderItemRequest): Promise<void> {
    const order = await this.ordersRepository.findOneById(orderId);

    if (!order) {
      throw new Error("Select a valid order");
    }

    await this.ordersItemsRepository.create({
      orderId,
      description,
      price,
      quantity,
    });
  }
}
