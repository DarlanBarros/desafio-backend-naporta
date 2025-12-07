/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { create } from "./create.js";
import { deleteOrder } from "./delete.js";
import { list } from "./list.js";
import { update } from "./update.js";

export async function ordersRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/order", list);
  app.post("/order", create);
  app.patch("/order/:id", update);
  app.delete("/order/:id", deleteOrder);
}
