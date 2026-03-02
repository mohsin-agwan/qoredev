import { QoreConnector } from "@/lib/engine";

// MAGIC: One connection to rule all providers in a category
const paymentMagic = new QoreConnector({
  category: "payments",
  providers: ["stripe", "paypal", "razorpay"],
  auth: "managed",
});

export const processUniversalPayment = async (data: {
  amount: number;
  user_id: string;
  currency?: string;
}) => {
  return await paymentMagic.execute("createCharge", {
    amount: data.amount,
    currency: data.currency ?? "USD",
    customer_id: data.user_id,
  });
};

export { paymentMagic };
