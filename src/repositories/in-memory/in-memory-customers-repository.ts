/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import { randomUUID } from "node:crypto";
import type { Customer, Prisma } from "@prisma/client";
import type { CustomersRepository } from "../customers-repository.js";

export class InMemoryCustomersRepository implements CustomersRepository {
  items: Customer[] = [];

  async findById(id: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.id === id);

    if (!customer) {
      return null;
    }

    return customer;
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.document === document);

    if (!customer) {
      return null;
    }

    return customer;
  }

  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    const customer: Customer = {
      id: randomUUID(),
      name: data.name,
      userId: data.userId,
      document: data.document,
    };

    this.items.push(customer);

    return customer;
  }
}
