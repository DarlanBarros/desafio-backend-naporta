import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { DomainError } from "@/use-cases/errors/domain-error.js";
import { makeCreateOrder } from "@/use-cases/factories/make-create-order.js";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    customerId: z.string(),
    deliveryAddress: z.string(),
    estimatedDeliveryDate: z.coerce.date(),
    orderItems: z.array(
      z.object({
        description: z.string(),
        price: z.number(),
        quantity: z.number(),
      })
    ),
  });

  const { customerId, deliveryAddress, estimatedDeliveryDate, orderItems } =
    createBodySchema.parse(request.body);

  const createOrderUseCase = makeCreateOrder();

  try {
    await createOrderUseCase.execute({
      customerId,
      deliveryAddress,
      estimatedDeliveryDate,
      orderItems,
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
