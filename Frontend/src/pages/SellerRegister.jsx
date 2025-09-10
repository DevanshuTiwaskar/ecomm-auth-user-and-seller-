// src/pages/SellerRegister.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sellerRegister } from "../store/slices/SellerSlice"; // ✅ correct thunk
import "./SellerRegister.css";
import "./UserRegister.css"; // reuse base auth styles

export default function SellerRegister() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const role = "seller";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { seller, loading, error } = useSelector((state) => state.seller);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // ✅ backend probably expects fullName as an object
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      fullName: {
        firstName: form.firstName,
        lastName: form.lastName,
      },
    };

    dispatch(sellerRegister(payload));
  }

  // Redirect after successful registration
  useEffect(() => {
    if (seller) {
      navigate("/seller/dashboard");
    }
  }, [seller, navigate]);

  function switchRole(nextRole) {
    if (nextRole === role) return;
    navigate(nextRole === "seller" ? "/seller/register" : "/user/register");
  }

  return (
    <div className="auth-wrapper">
      <div
        className="auth-card seller-register role-seller"
        role="region"
        aria-labelledby="seller-register-heading"
      >
        <div className="role-switch" role="tablist" aria-label="Account type">
          <button
            type="button"
            role="tab"
            aria-selected={role === "user"}
            className={role === "user" ? "active" : ""}
            onClick={() => switchRole("user")}
          >
            User
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "seller"}
            className={role === "seller" ? "active" : ""}
            onClick={() => switchRole("seller")}
          >
            Seller
          </button>
        </div>
        <span className="seller-badge" aria-hidden="true">
          SELLER
        </span>
        <header className="auth-header">
          <h1 id="seller-register-heading" className="auth-title">
            Create seller account
          </h1>
          <p className="auth-subtitle">
            Start selling with us. Just a few details.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="storehandle"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jane"
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          {/* 🔹 Show error/loading */}
          {loading && <p className="info">Registering...</p>}
          {error && <p className="error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create seller account"}
          </button>
          <p className="fine-print">
            By continuing you agree to our seller terms & privacy policy.
          </p>
        </form>

        <p className="switch-auth">
          Already a seller? <a href="/seller/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
