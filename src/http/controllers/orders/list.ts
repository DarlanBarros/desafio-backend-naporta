import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DomainError } from "@/use-cases/errors/domain-error.js";
import { makeListOrdersUseCase } from "@/use-cases/factories/make-list-orders.js";
import type { ListOrdersRequest } from "@/use-cases/list-orders.js";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listBodySchema = z.object({
    orderNumber: z.string().optional(),
    status: z
      .enum([
        "PENDING",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ])
      .optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });

  const body = listBodySchema.parse(request.query);

  const filters: ListOrdersRequest = {
    ...(body.orderNumber && { orderNumber: body.orderNumber }),
    ...(body.status && { status: body.status }),
    ...(body.startDate && { startDate: body.startDate }),
    ...(body.endDate && { endDate: body.endDate }),
  };

  const listOrders = makeListOrdersUseCase();

  try {
    const { ordersData } = await listOrders.execute(filters);

    return reply.status(200).send(ordersData);
  } catch (err) {
    if (err instanceof DomainError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      });
    }

    throw err;
  }
}
