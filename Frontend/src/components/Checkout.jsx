import axios from "axios";
import React from "react";

const Checkout = () => {

  const handlePayment = async () => {
    try {
      // Step 1: Create order on backend
      const { data: order } = await axios.post("http://localhost:3000/api/payment/create-order", {
        amount: 500 // Amount in INR
      });

      // Step 2: Razorpay options
      const options = {
        key: "rzp_test_R8ii8fDuBn4fEH", // Use .env variable for frontend
        amount: order.amount,
        currency: order.currency,
        name: "My Company",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          const { order_id, payment_id, signature } = response;
          try {
            await axios.post("http://localhost:3000/api/payment/verify-payment", {
              razorpayOrderId: order_id,
              razorpayPaymentId: payment_id,
              signature: signature,
            });
            alert("Payment successful!");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      style={{ padding: "10px 20px", background: "#3399cc", color: "#fff", border: "none", borderRadius: "5px" }}
    >
      Pay Now
    </button>
  );
};

export default Checkout;
