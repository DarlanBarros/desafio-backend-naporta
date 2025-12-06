import type { Customer, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { CustomersRepository } from "../customers-repository.js";

export class PrismaCustomersRepository implements CustomersRepository {
  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    const customer = await prisma.customer.create({ data });

    return customer;
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: {
        document,
      },
    });

    if (!customer) {
      return null;
    }

    return customer;
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return null;
    }

    return customer;
  }
}
