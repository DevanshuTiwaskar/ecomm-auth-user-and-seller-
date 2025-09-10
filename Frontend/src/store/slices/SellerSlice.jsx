// src/redux/slices/sellerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";


// Async thunk: fetch all seller products
export const fetchSellerProducts = createAsyncThunk(
  "seller/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/products/seller", {
        withCredentials: true,
      });
      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch seller products");
    }
  }
);

// Async thunk: seller login
export const sellerLogin = createAsyncThunk(
  "seller/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/auth/seller/login",
        credentials,
        { withCredentials: true }
      );
      return res.data; // probably token + seller info
    } catch (err) {
      return rejectWithValue(err.response?.data || "Seller login failed");
    }
  }
);

// Async thunk: seller register
export const sellerRegister = createAsyncThunk(
  "seller/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/auth/seller/register",
        formData,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Seller registration failed");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,        // seller profile info
    products: [],        // seller’s products
    loading: false,
    error: null,
  },
  reducers: {
    logoutSeller: (state) => {
      state.seller = null;
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Seller login
      .addCase(sellerLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Seller register
      .addCase(sellerRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(sellerRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(sellerRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
