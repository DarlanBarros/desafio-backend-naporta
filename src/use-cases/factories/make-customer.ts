import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository.js";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js";
import { CreateCustomerUseCase } from "../create-customer.js";

export function makeCreateCustomer() {
  const customersRepository = new PrismaCustomersRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateCustomerUseCase(
    customersRepository,
    usersRepository
  );

  return useCase;
}
