import React from "react";

const Checkout = ({ product }) => {
  const handlePayment = async () => {
    const res = await fetch("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: product.price.amount, // use product price
        userId: "64d8a2f12345abc67890xyz", // TODO: replace with logged-in user _id
        products: [product._id], // ✅ product from props
        address: "123, Delhi, India"
      })
    });

    const order = await res.json();

    const options = {
      key: "rzp_test_R8ii8fDuBn4fEH",
      amount: order.amount,
      currency: order.currency,
      name: "Ecommerce Store",
      description: product.title,
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await fetch("http://localhost:3000/api/payment/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId: "64d8a2f12345abc67890xyz"
          })
        });

        const result = await verifyRes.json();
        alert(result.message || "Payment processed");
      },
      prefill: {
        name: "Devanshu",
        email: "dev@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button 
      onClick={handlePayment} 
      className="btn-buy"
      style={{
        backgroundColor: '#3399cc',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600'
      }}
    >
      Buy Now
    </button>
  );
};

export default Checkout;
