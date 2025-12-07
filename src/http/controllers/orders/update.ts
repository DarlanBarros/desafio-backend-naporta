import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DomainError } from "@/use-cases/errors/domain-error.js";
import { makeUpdateOrderUseCase } from "@/use-cases/factories/make-update-order.js";
import type { UpdateOrderRequest } from "@/use-cases/update-order.js";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  });

  const updateBodySchema = z.object({
    deliveryAddress: z.string().optional(),
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
    estimatedDeliveryDate: z.date().optional(),
  });

  const body = updateBodySchema.parse(request.body);
  const { id } = updateParamsSchema.parse(request.params);

  const data: UpdateOrderRequest = {
    ...(body.deliveryAddress && { deliveryAddress: body.deliveryAddress }),
    ...(body.status && { status: body.status }),
    ...(body.estimatedDeliveryDate && {
      estimatedDeliveryDate: body.estimatedDeliveryDate,
    }),
  };

  const updateOrders = makeUpdateOrderUseCase();

  try {
    const { order } = await updateOrders.execute(id, data);

    return reply.status(200).send(order);
  } catch (err) {
    if (err instanceof DomainError) {
      return reply.status(err.statusCode).send({
        message: err.message,
      });
    }

    throw err;
  }
}
