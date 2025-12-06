import type { Order } from "@prisma/client";
import { Decimal } from "decimal.js";
import type { CustomersRepository } from "@/repositories/customers-repository.js";
import type { OrdersItemsRepository } from "@/repositories/orders-items-repository.js";
import type { OrdersRepository } from "@/repositories/orders-repository.js";
import { CustomerNotExistsError } from "./errors/customer-not-exists-error.js";
import { EmptyOrderItemsError } from "./errors/empty-order-items-error.js";

interface OrderItems {
  description: string;
  price: number;
  quantity: number;
}

interface CreateOrderRequest {
  customerId: string;
  estimatedDeliveryDate: Date;
  deliveryAddress: string;
  orderItems: OrderItems[];
}

interface CreateOrderResponse {
  order: Order;
}

export class CreateOrderUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private ordersRepository: OrdersRepository,
    private ordersItemsRepository: OrdersItemsRepository
  ) {}

  async execute({
    customerId,
    deliveryAddress,
    estimatedDeliveryDate,
    orderItems,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new CustomerNotExistsError();
    }

    if (orderItems.length < 1) {
      throw new EmptyOrderItemsError();
    }

    const orderNumber = `P-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await this.ordersRepository.create({
      orderNumber,
      customerId,
      deliveryAddress,
      estimatedDeliveryDate,
    });

    orderItems.map(async (item) => {
      await this.ordersItemsRepository.create({
        description: item.description,
        price: new Decimal(item.price),
        quantity: item.quantity,
        orderId: order.id,
      });
    });

    return { order };
  }
}
