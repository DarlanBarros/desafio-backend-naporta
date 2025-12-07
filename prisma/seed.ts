import { prisma } from "@/lib/prisma.js";
import { makeCreateOrder } from "@/use-cases/factories/make-create-order.js";
import { makeCreateCustomer } from "@/use-cases/factories/make-customer.js";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register.js";

// Use-cases

async function seed() {
  console.log("🌱 Starting database seed...");

  // --------------------------
  // 1️⃣ CREATE USER
  // --------------------------

  const createUser = makeRegisterUseCase();

  const { user } = await createUser.execute({
    name: "Demo User",
    email: "demo@teste.com",
    password: "123456",
  });

  console.log("✅ User created", user.id);

  // --------------------------
  // 2️⃣ CREATE CUSTOMER
  // --------------------------

  const createCustomer = makeCreateCustomer();

  const { customer } = await createCustomer.execute({
    userId: user.id,
    name: "Demo Customer",
    document: "12345678901",
  });

  console.log("✅ Customer created", customer.id);

  // --------------------------
  // 3️⃣ CREATE ORDERS
  // --------------------------

  const createOrder = makeCreateOrder();

  for (let i = 1; i <= 5; i++) {
    await createOrder.execute({
      customerId: customer.id,

      deliveryAddress: `Rua das Flores, ${i}`,
      estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * i),

      orderItems: [
        {
          description: "Calça Preta 40",
          price: 100.0,
          quantity: 2,
        },
        {
          description: "Camisa Branca G",
          price: 50.0,
          quantity: 1,
        },
      ],
    });

    console.log(`✅ Order ${i} created`);
  }

  console.log("🌱 Seed completed successfully!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
