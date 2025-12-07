import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DomainError } from "@/use-cases/errors/domain-error.js";
import { makeUpdateOrderItem } from "@/use-cases/factories/make-update-order-item.js";
import type { UpdateOrderItemRequest } from "@/use-cases/update-order-items.js";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  });

  const updateBodySchema = z.object({
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    quantity: z.coerce.number().optional(),
  });

  const body = updateBodySchema.parse(request.body);
  const { id } = updateParamsSchema.parse(request.params);

  const data: UpdateOrderItemRequest = {
    ...(body.description && { description: body.description }),
    ...(body.price && { price: body.price }),
    ...(body.quantity && {
      quantity: body.quantity,
    }),
  };

  const updateOrderItems = makeUpdateOrderItem();

  try {
    await updateOrderItems.execute(id, data);
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
