import type { Customer, User } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository.js";
import { InMemoryOrdersItemsRepository } from "@/repositories/in-memory/in-memory-orders-items-repository.js";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.js";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { CreateOrderUseCase } from "../create-order.js";
import { UpdateOrderUseCase } from "../update-order.js";

let ordersRepository: InMemoryOrdersRepository;
let ordersItemsRepository: InMemoryOrdersItemsRepository;
let customersRepository: InMemoryCustomersRepository;
let usersRepository: InMemoryUsersRepository;

let createOrderUseCase: CreateOrderUseCase;
let sut: UpdateOrderUseCase;

let user: User;
let customer: Customer;

describe("Edit Orders", () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository();
    ordersItemsRepository = new InMemoryOrdersItemsRepository();
    customersRepository = new InMemoryCustomersRepository();
    usersRepository = new InMemoryUsersRepository();
    createOrderUseCase = new CreateOrderUseCase(
      customersRepository,
      ordersRepository,
      ordersItemsRepository
    );
    sut = new UpdateOrderUseCase(ordersRepository);

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

  it("should be able to edit an order", async () => {
    const { order } = await createOrderUseCase.execute({
      customerId: customer.id,
      deliveryAddress: "Cantagalo RJ",
      estimatedDeliveryDate: new Date(2025, 12, 5),
      orderItems: [
        {
          description: "Camisa Amarela P",
          price: 25.9,
          quantity: 1,
        },
      ],
    });

    await sut.execute(order.id, {
      status: "PAID",
    });

    expect(ordersRepository.items[0]?.status).toEqual("PAID");
  });
});
