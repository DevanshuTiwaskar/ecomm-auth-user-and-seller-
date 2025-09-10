import { useMemo, useState, useEffect } from "react";
import "./SellerDashboard.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../store/slices/SellerSlice";

export default function SellerDashboard() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  // access state from Redux
  const { products, loading, error } = useSelector((state) => state.seller);

  // fetch products on mount
  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  // filter by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  // metrics
  const totalStock = filtered.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalProducts = filtered.length;
  const lowStockCount = filtered.filter(
    (p) => p.stock !== undefined && p.stock < 5
  ).length;

  return (
    <div className="dashboard-shell role-seller" aria-labelledby="dash-title">
      <header className="dash-header">
        <h1 id="dash-title" className="dash-title">
          Seller Dashboard
        </h1>
        <p className="dash-sub">Overview of your products & stock status.</p>
      </header>

      {/* Loading & error states */}
      {loading && <p>Loading products...</p>}
      {error && <p className="error">❌ {error}</p>}

      <section className="cards-grid" aria-label="Metrics">
        <div className="metric-card">
          <span className="metric-label">Products</span>
          <span className="metric-value" aria-live="polite">
            {totalProducts}
          </span>
          <span className="metric-foot">Total active products</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Stock Units</span>
          <span className="metric-value" aria-live="polite">
            {totalStock}
          </span>
          <span className="metric-foot">Combined available stock</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Low Stock</span>
          <span className="metric-value" aria-live="polite">
            {lowStockCount}
          </span>
          <span className="metric-foot">Below threshold (&lt;5)</span>
        </div>
      </section>

      <section className="products-section" aria-labelledby="products-heading">
        <div className="section-head">
          <h2 id="products-heading">Products</h2>
          <div className="filters-bar">
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 && !loading ? (
          <div className="empty-state" role="status">
            <strong>No products found</strong>
            Try adjusting your search.
          </div>
        ) : (
          <div className="products-grid" role="list">
            {filtered.map((p) => {
              const cover = p.images?.[0];
              const priceFmt = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: p.price.currency,
              }).format(p.price.amount / 100);
              const low = p.stock < 5;
              return (
                <Link
                  to={`/product/${p._id}`}
                  key={p._id}
                  className="product-card-link"
                >
                  <article
                    className="product-card"
                    role="listitem"
                    aria-label={p.title}
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={p.title}
                        className="product-thumb"
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-thumb" aria-hidden="true" />
                    )}
                    <div className="product-body">
                      <h3 className="product-title" title={p.title}>
                        {p.title}
                      </h3>
                      <p className="product-desc" title={p.description}>
                        {p.description}
                      </p>
                      <div className="price-stock">
                        <span className="price">{priceFmt}</span>
                        <span className={`stock ${low ? "low" : ""}`}>
                          {p.stock} in stock
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
