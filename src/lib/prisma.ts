import { PrismaClient } from "@prisma/client";
import { env } from "../env/index.js";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});

prisma.$use(async (params, next) => {
  if (
    params.model === "Order" &&
    ["findMany", "findFirst", "findUnique"].includes(params.action)
  ) {
    params.args.where = {
      deletedAt: null,
      ...params.args.where,
    };
  }

  return await next(params);
});
