import type { Order } from "@prisma/client";
import { Decimal } from "decimal.js";
import type { CustomersRepository } from "@/repositories/customers-repository.js";
import type { OrdersItensRepository } from "@/repositories/orders-itens-repository.js";
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
  orderItens: OrderItems[];
}

interface CreateOrderResponse {
  order: Order;
}

export class CreateOrderUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private ordersRepository: OrdersRepository,
    private ordersItensRepository: OrdersItensRepository
  ) {}

  async execute({
    customerId,
    deliveryAddress,
    estimatedDeliveryDate,
    orderItens,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const customer = await this.customersRepository.findOne(customerId);

    if (!customer) {
      throw new CustomerNotExistsError();
    }

    if (orderItens.length < 1) {
      throw new EmptyOrderItemsError();
    }

    const orderNumber = `P-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await this.ordersRepository.create({
      orderNumber,
      customerId,
      deliveryAddress,
      estimatedDeliveryDate,
    });

    orderItens.map(async (item) => {
      await this.ordersItensRepository.create({
        description: item.description,
        price: new Decimal(item.price),
        quantity: item.quantity,
        orderId: order.id,
      });
    });

    return { order };
  }
}
