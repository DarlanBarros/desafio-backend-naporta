import type { Customer, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository.js";
import { InMemoryOrdersItemsRepository } from "@/repositories/in-memory/in-memory-orders-items-repository.js";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.js";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { CreateOrderUseCase } from "../create-order.js";
import { CustomerNotExistsError } from "../errors/customer-not-exists-error.js";
import { EmptyOrderItemsError } from "../errors/empty-order-items-error.js";

let ordersRepository: InMemoryOrdersRepository;
let ordersItemsRepository: InMemoryOrdersItemsRepository;
let customersRepository: InMemoryCustomersRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateOrderUseCase;

let user: User;
let customer: Customer;

describe("Create Order", () => {
  beforeEach(async () => {
    ordersItemsRepository = new InMemoryOrdersItemsRepository();
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateOrderUseCase(
      customersRepository,
      ordersRepository,
      ordersItemsRepository
    );

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

  it("should be able to create an order", async () => {
    const { order } = await sut.execute({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date("2025-12-08"),
      orderItems: [
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
        orderItems: [],
      })
    ).rejects.toBeInstanceOf(CustomerNotExistsError);
  });

  it("should not be able to create an order without items", async () => {
    await expect(() =>
      sut.execute({
        customerId: customer.id,
        deliveryAddress: "Cantagalo RJ",
        estimatedDeliveryDate: new Date("2025-12-08"),
        orderItems: [],
      })
    ).rejects.toBeInstanceOf(EmptyOrderItemsError);
  });
});
