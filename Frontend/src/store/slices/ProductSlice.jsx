import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client";



export const fetchProduct = createAsyncThunk(
    "products/fetchProduct",
    async () => {
        const res = await api.get(`/api/products/`);
        return res.data
    }
) 


export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",

    async (id) => {
        const res = await api.get(`/products/${id}`)
        return res.data
    }
)


const productSlice = createSlice({
    name: "product",
    initialState: {
        list: [],
        current: null,
        loading: false,
        error: null
    },
    reducers: {},
 extraReducers: (builder) => {
  builder
    .addCase(fetchProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    })
    .addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    .addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.current = action.payload;
    })
    .addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}


})



export default productSlice.reducer