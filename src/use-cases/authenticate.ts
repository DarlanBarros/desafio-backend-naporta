import type { User } from "@prisma/client";
import { compare } from "bcryptjs";
import type { UsersRepository } from "@/repositories/users-repository.js";
import { InvalidCredentialError } from "./errors/invalid-credentials-error.js";

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialError();
    }

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialError();
    }

    return {
      user,
    };
  }
}
