import type { Order, OrderStatus } from "@prisma/client";
import type { OrdersRepository } from "@/repositories/orders-repository.js";
import { OrderNotFoundError } from "./errors/order-not-found-error.js";

export interface UpdateOrderRequest {
  estimatedDeliveryDate?: Date;
  deliveryAddress?: string;
  status?: OrderStatus;
}

interface UpdateOrderResponse {
  order: Order;
}

export class UpdateOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    orderId: string,
    data: UpdateOrderRequest
  ): Promise<UpdateOrderResponse> {
    const orderExists = await this.ordersRepository.findOneById(orderId);

    if (!orderExists || orderExists.deletedAt) {
      throw new OrderNotFoundError();
    }

    const orderUpdated = await this.ordersRepository.update(orderId, data);

    return { order: orderUpdated };
  }
}
