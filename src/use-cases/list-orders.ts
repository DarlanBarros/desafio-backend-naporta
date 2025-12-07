import type { OrderStatus } from "@prisma/client";
import type { CustomersRepository } from "@/repositories/customers-repository.js";
import type { OrdersItemsRepository } from "@/repositories/orders-items-repository.js";
import type { OrdersRepository } from "@/repositories/orders-repository.js";

interface OrderItemResponse {
  description: string;
  price: number;
}

interface CustomerResponse {
  name: string;
  document: string;
}

interface OrdersData {
  id: string;
  orderNumber: string;
  deliveryAddress: string;
  estimatedDeliveryDate: Date;
  status: OrderStatus;
  createdAt: Date;
  customer: CustomerResponse;
  items: OrderItemResponse[];
}

export interface ListOrdersRequest {
  orderNumber?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

interface ListOrdersResponse {
  ordersData: OrdersData[];
}

export class ListOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private orderItemsRepository: OrdersItemsRepository
  ) {}

  async execute(filters: ListOrdersRequest): Promise<ListOrdersResponse> {
    const ordersData: OrdersData[] = [];
    const orders = await this.ordersRepository.findManyByFilter(filters);

    for (const order of orders) {
      const customer = await this.customersRepository.findById(
        order.customerId
      );
      ordersData.push({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: customer?.name ?? "",
          document: customer?.document ?? "",
        },
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        createdAt: order.createdAt,
        items: await this.orderItemsRepository.findManyByOrderId(order.id),
      });
    }

    return { ordersData };
  }
}
