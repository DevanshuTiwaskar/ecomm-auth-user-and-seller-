import { useParams } from "react-router-dom";
import { useState } from "react";
import "./ProductDetails.css";
import { useEffect } from "react";
import axios from "axios";
import Checkout from "../components/Checkout";



export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // const product = useMemo(() => sampleProducts.find(p => p._id === id) || sampleProducts[0], [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((error) =>
        console.log("error fetching product details from api", error)
      );
  }, [id]);

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
          {!out ? (
            <Checkout product={product} />
          ) : (
            <button className="btn-buy" disabled>
              Unavailable
            </button>
          )}
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
