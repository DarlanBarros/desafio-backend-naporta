import type { Customer } from "@prisma/client";
import type { CustomersRepository } from "@/repositories/customers-repository.js";
import type { UsersRepository } from "@/repositories/users-repository.js";

interface CreateCustomerRequest {
  userId: string;
  name: string;
  document: string;
}

interface CreateCustomerResponse {
  customer: Customer;
}

export class CreateCustomerUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    name,
    document,
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const userExists = await this.usersRepository.findById(userId);
    const customerExists =
      await this.customersRepository.findByDocument(document);

    if (customerExists) {
      throw new Error("Customer already exists");
    }

    if (!userExists) {
      throw new Error("User not found");
    }

    const customer = await this.customersRepository.create({
      userId,
      name,
      document,
    });

    return { customer };
  }
}
