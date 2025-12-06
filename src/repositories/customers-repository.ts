import type { Customer, Prisma } from "@prisma/client";

export interface CustomersRepository {
  create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByDocument(document: string): Promise<Customer | null>;
}
