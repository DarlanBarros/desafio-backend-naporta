import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js";
import { CreateUserUseCase } from "../create-user.js";

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepository();
  const useCase = new CreateUserUseCase(userRepository);

  return useCase;
}
