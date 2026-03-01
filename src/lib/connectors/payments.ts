import { QoreConnector } from "@qoredev/engine";

// MAGIC: One connection to rule all providers in a category
const paymentMagic = new QoreConnector({
  category: "payments",
  providers: ["stripe", "paypal", "razorpay"], // Active via manifest toggles
  auth: "managed", // QoreDev handles OAuth/API keys automatically
});

export const processUniversalPayment = async (data: {
  amount: number;
  user_id: string;
}) => {
  // Logic: Connects to whatever is 'Enabled' in your manifest in seconds
  return await paymentMagic.execute("createCharge", {
    amount: data.amount,
    currency: "USD",
    customer_id: data.user_id,
  });
};

export { paymentMagic };
