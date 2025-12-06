import type { User } from "@prisma/client";
import { hash } from "bcryptjs";
import type { UsersRepository } from "@/repositories/users-repository.js";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  user: User;
}

export class CreateUserUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password: password_hash,
    });

    return {
      user,
    };
  }
}
