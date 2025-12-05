/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository.js";
import { InMemoryOrdersItensRepository } from "@/repositories/in-memory/in-memory-orders-itens-repository.js";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.js";
import { ListOrdersUseCase } from "./list-orders.js";

let ordersRepository: InMemoryOrdersRepository;
let ordersItensRepository: InMemoryOrdersItensRepository;
let customersRepository: InMemoryCustomersRepository;
let sut: ListOrdersUseCase;

describe("List Orders", () => {
  beforeEach(() => {
    ordersItensRepository = new InMemoryOrdersItensRepository();
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    sut = new ListOrdersUseCase(
      ordersRepository,
      customersRepository,
      ordersItensRepository
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to list orders", async () => {
    customersRepository.items.push({
      id: "customer-01",
      name: "John Doe",
      document: "01524875149",
    });

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    ordersItensRepository.create({
      orderId: "P-XYZ",
      description: "Camiseta Vermelha P",
      price: 34.9,
      quantity: 1,
    });

    ordersItensRepository.create({
      orderId: "P-XYZ",
      description: "Camiseta Azul M",
      price: 34.9,
      quantity: 1,
    });

    const { ordersData } = await sut.execute({});

    expect(ordersData).toHaveLength(1);
    expect(ordersData[0]?.items[1]).toEqual(
      expect.objectContaining({
        description: "Camiseta Azul M",
        price: 34.9,
      })
    );
  });

  it("should be able to list orders filtering by number", async () => {
    customersRepository.items.push({
      id: "customer-01",
      name: "John Doe",
      document: "01524875149",
    });

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-07"),
      orderNumber: "P-ABC",
    });

    ordersItensRepository.create({
      orderId: "P-ABC",
      description: "Camiseta Vermelha P",
      price: 55.5,
      quantity: 1,
    });

    ordersItensRepository.create({
      orderId: "P-XYZ",
      description: "Camiseta Azul M",
      price: 34.9,
      quantity: 1,
    });

    const { ordersData } = await sut.execute({
      orderNumber: "P-ABC",
    });

    expect(ordersData).toHaveLength(1);
    expect(ordersData[0]?.items[0]).toEqual(
      expect.objectContaining({
        description: "Camiseta Vermelha P",
        price: 55.5,
      })
    );
  });

  it("should be able to list orders filtering by date", async () => {
    vi.setSystemTime(new Date(2025, 12, 3, 16, 46));

    customersRepository.items.push({
      id: "customer-01",
      name: "John Doe",
      document: "01524875149",
    });

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    const OneDayInMs = 1000 * 60 * 60 * 24;

    vi.advanceTimersByTime(OneDayInMs);

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-07"),
      orderNumber: "P-ABC",
    });

    ordersItensRepository.create({
      orderId: "P-ABC",
      description: "Camiseta Vermelha P",
      price: 55.5,
      quantity: 1,
    });

    ordersItensRepository.create({
      orderId: "P-XYZ",
      description: "Camiseta Azul M",
      price: 34.9,
      quantity: 1,
    });

    const { ordersData } = await sut.execute({
      startDate: new Date(2025, 12, 3, 16, 46),
      endDate: new Date(2025, 12, 4, 19, 55),
    });

    expect(ordersData).toHaveLength(2);
  });

  it("should be able to list orders filtering by status", async () => {
    customersRepository.items.push({
      id: "customer-01",
      name: "John Doe",
      document: "01524875149",
    });

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-07"),
      orderNumber: "P-ABC",
    });

    ordersItensRepository.create({
      orderId: "P-ABC",
      description: "Camiseta Vermelha P",
      price: 55.5,
      quantity: 1,
    });

    ordersItensRepository.create({
      orderId: "P-XYZ",
      description: "Camiseta Azul M",
      price: 34.9,
      quantity: 1,
    });

    const { ordersData } = await sut.execute({
      status: "PENDING",
    });

    expect(ordersData).toHaveLength(2);
  });
});
