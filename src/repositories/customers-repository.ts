import type { Customer } from "@prisma/client";

export interface CustomersRepository {
  findOne(id: string): Promise<Customer | null>;
  getName(customerId: string): Promise<string>;
  getDocument(customerId: string): Promise<string>;
}
