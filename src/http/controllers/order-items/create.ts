import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DomainError } from "@/use-cases/errors/domain-error.js";
import { makeCreateOrderItem } from "@/use-cases/factories/make-create-order-item.js";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    orderId: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    quantity: z.coerce.number(),
  });

  const { orderId, description, price, quantity } = createBodySchema.parse(
    request.body
  );

  const createOrderItemUseCase = makeCreateOrderItem();

  try {
    await createOrderItemUseCase.execute({
      orderId,
      description,
      price,
      quantity,
    });
  } catch (err) {
    if (err instanceof DomainError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      });
    }

    throw err;
  }

  return reply.status(201).send();
}
