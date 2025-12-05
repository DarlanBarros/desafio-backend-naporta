/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import type { Customer } from "@prisma/client";
import type { CustomersRepository } from "../customers-repository.js";

export class InMemoryCustomersRepository implements CustomersRepository {
  items: Customer[] = [];

  async getName(customerId: string): Promise<string> {
    const customer = this.items.find((item) => item.id === customerId);

    if (!customer) {
      return "";
    }

    return customer.name;
  }

  async getDocument(customerId: string): Promise<string> {
    const customer = this.items.find((item) => item.id === customerId);

    if (!customer) {
      return "";
    }

    return customer.document;
  }

  async findOne(id: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.id === id);

    if (!customer) {
      return null;
    }

    return customer;
  }
}
