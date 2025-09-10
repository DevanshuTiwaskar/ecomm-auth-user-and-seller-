import { useParams } from "react-router-dom";
import { useState } from "react";
import "./ProductDetails.css";
import { useEffect } from "react";
import Checkout from "../components/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../store/slices/ProductSlice";
import api from "../api/client";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    current: product,
    loading,
    error,
  } = useSelector((state) => state.product || {});





  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="pd-shell">
        <p>loading product.. </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-shell">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }




async function handleBuy() {
  try {
    const response = await api.post(`/payment/create/${id}`, {}, { withCredentials: true });
    console.log(response.data);

    const options = {
      key: "rzp_test_R8ii8fDuBn4fEH",
      amount: response.data.orderamount,
      currency: response.data.order.currency,
      name: "My ecomm",
      description: "Test Transaction",
      order_id: response.data.order.orderId,
      handler: async function (razorResponse) {
        try {
          const verifyRes = await api.post("/payment/verify", {
            razorpayOrderId: razorResponse.razorpay_order_id,
            razorpayPaymentId: razorResponse.razorpay_payment_id,
            signature: razorResponse.razorpay_signature
          }, { withCredentials: true });

          console.log("Payment verified:", verifyRes.data);
        } catch (err) {
          console.error("Verification error:", err);
        }
      },
      prefill: {
        name: `${response.data.user.fullName.firstName} ${response.data.user.fullName.lastName}`,
        email: response.data.user.email
      },
      theme: { color: "#3399cc" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment creation error:", err);
  }
}




  
  // const [product, setProduct] = useState(null);

  // const product = useMemo(() => sampleProducts.find(p => p._id === id) || sampleProducts[0], [id]);

  // useEffect(() => {
  //   api
  //     .get(`/products/${id}`)
  //     .then((res) => setProduct(res.data))
  //     .catch((error) =>
  //       console.log("error fetching product details from api", error)
  //     );
  // }, [id]);

  if (!product) {
    return (
      <div className="pd-shell">
        <p>Product not found.</p>
      </div>
    );
  }

  const priceFmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price.currency,
  }).format(product.price.amount / 100);

  const activeImage = product.images?.[activeIndex];
  const out = product.stock <= 0;

  return (
    <div className="pd-shell" aria-labelledby="pd-title">
      <div className="pd-media" aria-label="Product images">
        {activeImage ? (
          <img src={activeImage} alt={product.title} className="pd-main-img" />
        ) : (
          <div className="pd-main-img" aria-hidden="true" />
        )}
        {product.images && product.images.length > 1 && (
          <div className="pd-thumbs" role="list">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                className={`pd-thumb ${i === activeIndex ? "active" : ""}`}
                role="listitem"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pd-info">
        <h1 id="pd-title" className="pd-title">
          {product.title}
        </h1>
        <div className={`pd-stock ${out ? "out" : ""}`}>
          {out ? "Out of stock" : `${product.stock} in stock`}
        </div>
        <div className="pd-price" aria-live="polite">
          {priceFmt}
        </div>
        <p className="pd-desc">{product.description}</p>



        <div className="pd-actions">
            <button onClick={handleBuy} className="btn-buy" disabled={out}>{out ? 'Unavailable' : 'Buy now'}</button>
        </div>

        <div className="pd-meta">
          <span>
            <strong>ID:</strong> {product._id}
          </span>
          <span>
            <strong>Currency:</strong> {product.price.currency}
          </span>
        </div>
      </div>
    </div>
  );
}
