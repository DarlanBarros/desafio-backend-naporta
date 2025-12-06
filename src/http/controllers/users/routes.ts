/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import type { FastifyInstance } from "fastify";
import { autheticate } from "./authenticate.js";
import { refresh } from "./refresh.js";
import { register } from "./register.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", autheticate);

  app.patch("/token/refresh", refresh);
}
