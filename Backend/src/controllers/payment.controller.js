const razorpay = require("../../config/Razorpay.config");
const crypto = require("crypto");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");

// 1️⃣ Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", userId, products, address } = req.body;

    // Razorpay requires amount in paisa
    const options = {
      amount: amount * 100,
      currency,
    };

    const order = await razorpay.orders.create(options);

    // Save Payment record (pending)
    const payment = await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });

    // Save Order record

const newOrder = await orderModel.create({
  orderId: order.id,
  user: userId,            // <-- Required
  products,                // <-- Required
  totalPrice: amount,
  address,
  status: "pending",
  payment: [payment._id],
});


    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// 2️⃣ Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      // ✅ Update Payment
      const payment = await paymentModel.findOneAndUpdate(
        { orderId: order_id },
        {
          paymentId: payment_id,
          signature,
          status: "success",
        },
        { new: true }
      );

      // ✅ Update Order status
      await orderModel.findOneAndUpdate(
        { orderId: order_id },
        { status: "confirmed" }
      );

      return res.json({ success: true, message: "Payment Verified", payment });
    } else {
      // ❌ Update Payment as failed
      await paymentModel.findOneAndUpdate(
        { orderId: order_id },
        { status: "failed" }
      );

      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};

module.exports = {
createOrder,
verifyPayment

}