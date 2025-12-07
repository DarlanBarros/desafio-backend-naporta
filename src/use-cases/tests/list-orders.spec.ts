/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import type { Customer, User } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository.js";
import { InMemoryOrdersItemsRepository } from "@/repositories/in-memory/in-memory-orders-items-repository.js";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.js";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { ListOrdersUseCase } from "../list-orders.js";

let ordersRepository: InMemoryOrdersRepository;
let ordersItemsRepository: InMemoryOrdersItemsRepository;
let customersRepository: InMemoryCustomersRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ListOrdersUseCase;

let user: User;
let customer: Customer;

describe("List Orders", () => {
  beforeEach(async () => {
    ordersItemsRepository = new InMemoryOrdersItemsRepository();
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ListOrdersUseCase(
      ordersRepository,
      customersRepository,
      ordersItemsRepository
    );

    vi.useFakeTimers();

    user = await usersRepository.create({
      name: "Jhon Doe",
      email: "johndoe@example.com",
      password: "12345678",
    });

    customer = await customersRepository.create({
      userId: user.id,
      name: "Jhon Doe",
      document: "157.462.852-45",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to list orders", async () => {
    const order = await ordersRepository.create({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    ordersItemsRepository.create({
      orderId: order.id,
      description: "Camiseta Vermelha P",
      price: 34.9,
      quantity: 1,
    });

    ordersItemsRepository.create({
      orderId: order.id,
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
    const order1 = await ordersRepository.create({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    const order2 = await ordersRepository.create({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-07"),
      orderNumber: "P-ABC",
    });

    ordersItemsRepository.create({
      orderId: order1.id,
      description: "Camiseta Vermelha P",
      price: 55.5,
      quantity: 1,
    });

    ordersItemsRepository.create({
      orderId: order2.id,
      description: "Camiseta Azul M",
      price: 34.9,
      quantity: 1,
    });

    const { ordersData } = await sut.execute({
      orderNumber: "P-XYZ",
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

    const order = await ordersRepository.create({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    const OneDayInMs = 1000 * 60 * 60 * 24;

    vi.advanceTimersByTime(OneDayInMs);

    const order2 = await ordersRepository.create({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-07"),
      orderNumber: "P-ABC",
    });

    ordersItemsRepository.create({
      orderId: order.id,
      description: "Camiseta Vermelha P",
      price: 55.5,
      quantity: 1,
    });

    ordersItemsRepository.create({
      orderId: order2.id,
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
    const order = await ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderNumber: "P-XYZ",
    });

    const order2 = await ordersRepository.create({
      customerId: "customer-01",
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-07"),
      orderNumber: "P-ABC",
    });

    ordersItemsRepository.create({
      orderId: order.id,
      description: "Camiseta Vermelha P",
      price: 55.5,
      quantity: 1,
    });

    ordersItemsRepository.create({
      orderId: order2.id,
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
