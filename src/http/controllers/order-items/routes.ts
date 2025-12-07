/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { create } from "./create.js";
import { deleteOrderItem } from "./delete.js";
import { update } from "./update.js";

export async function orderItemsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/order/item", create);
  app.patch("/order/item/:id", update);
  app.delete("/order/item/:id", deleteOrderItem);
}
