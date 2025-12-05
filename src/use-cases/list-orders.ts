import type { OrderStatus } from "@prisma/client";
import type { CustomersRepository } from "@/repositories/customers-repository.js";
import type { OrdersItensRepository } from "@/repositories/orders-itens-repository.js";
import type { OrdersRepository } from "@/repositories/orders-repository.js";

interface CustomerResponse {
  name: string;
  document: string;
}

interface OrderItemResponse {
  description: string;
  price: number;
}

export interface ListOrdersRequest {
  orderNumber?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface OrdersData {
  id: string;
  orderNumber: string;
  deliveryAddress: string;
  estimatedDeliveryDate: Date;
  status: OrderStatus;
  createdAt: Date;
  customer: CustomerResponse;
  items: OrderItemResponse[];
}

interface ListOrdersResponse {
  ordersData: OrdersData[];
}

export class ListOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private orderItemsRepository: OrdersItensRepository
  ) {}

  async execute(filters: ListOrdersRequest): Promise<ListOrdersResponse> {
    const ordersData: OrdersData[] = [];
    const orders = await this.ordersRepository.findManyByFilter(filters);

    for (const order of orders) {
      ordersData.push({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: await this.customersRepository.getName(order.customerId),
          document: await this.customersRepository.getDocument(
            order.customerId
          ),
        },
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        createdAt: order.createdAt,
        items: await this.orderItemsRepository.findManyByOrderId(
          order.orderNumber
        ),
      });
    }

    return { ordersData };
  }
}
