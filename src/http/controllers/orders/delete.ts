import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DomainError } from "@/use-cases/errors/domain-error.js";
import { makeDeleteOrderUseCase } from "@/use-cases/factories/make-delete-order.js";

export async function deleteOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteParamsSchema.parse(request.params);

  const deleteOrders = makeDeleteOrderUseCase();

  try {
    await deleteOrders.execute({ id });
  } catch (err) {
    if (err instanceof DomainError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      });
    }

    throw err;
  }

  return reply.status(204).send();
}
