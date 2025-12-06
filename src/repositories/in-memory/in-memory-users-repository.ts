/** biome-ignore-all lint/suspicious/useAwait: <explanation> */

import { randomUUID } from "node:crypto";
import type { Prisma, User } from "@prisma/client";
import type { UsersRepository } from "../users-repository.js";

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      role: "MEMBER",
      name: data.name,
      email: data.email,
      password: data.password,
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === userId);

    if (!user) {
      return null;
    }

    return user;
  }
}
