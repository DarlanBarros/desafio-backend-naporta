import { beforeEach } from "node:test";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app.js";
import { makeCreateCustomer } from "@/use-cases/factories/make-customer.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";

describe("Create Order (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await app.close();
  });

  it("should be able to create an order", async () => {
    const createCustomer = makeCreateCustomer();

    const { token, user } = await createAndAuthenticateUser(app, true);

    const { customer } = await createCustomer.execute({
      userId: user.id,
      name: "John Doe",
      document: "12345678901",
    });

    const response = await request(app.server)
      .post("/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
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

    expect(response.statusCode).toEqual(201);
  });
});
