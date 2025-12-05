import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository.js";
import { InMemoryOrdersItensRepository } from "@/repositories/in-memory/in-memory-orders-itens-repository.js";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.js";
import { CreateOrderUseCase } from "./create-order.js";
import { CustomerNotExistsError } from "./errors/customer-not-exists-error.js";
import { EmptyOrderItemsError } from "./errors/empty-order-items-error.js";

let ordersRepository: InMemoryOrdersRepository;
let ordersItensRepository: InMemoryOrdersItensRepository;
let customersRepository: InMemoryCustomersRepository;
let sut: CreateOrderUseCase;

describe("Create Order", () => {
  beforeEach(() => {
    ordersItensRepository = new InMemoryOrdersItensRepository();
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    sut = new CreateOrderUseCase(
      customersRepository,
      ordersRepository,
      ordersItensRepository
    );
  });

  it("should be able to create an order", async () => {
    customersRepository.items.push({
      id: "customer-01",
      name: "John Doe",
      document: "01524875149",
    });

    const { order } = await sut.execute({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderItens: [
        {
          description: "Camisa Branca M",
          quantity: 2,
          price: 80.5,
        },
        {
          description: "Bermuda Preta M",
          quantity: 1,
          price: 50.0,
        },
      ],
    });

    expect(order.id).toEqual(expect.any(String));
  });

  it("should not be able to create an order without a valid customer", async () => {
    await expect(() =>
      sut.execute({
        customerId: "customer-01",
        deliveryAddress: "Cantagalo RJ",
        estimatedDeliveryDate: new Date("2025-12-08"),
        orderItens: [],
      })
    ).rejects.toBeInstanceOf(CustomerNotExistsError);
  });

  it("should not be able to create an order without items", async () => {
    customersRepository.items.push({
      id: "customer-01",
      name: "John Doe",
      document: "01524875149",
    });

    await expect(() =>
      sut.execute({
        customerId: "customer-01",
        deliveryAddress: "Cantagalo RJ",
        estimatedDeliveryDate: new Date("2025-12-08"),
        orderItens: [],
      })
    ).rejects.toBeInstanceOf(EmptyOrderItemsError);
  });
});
