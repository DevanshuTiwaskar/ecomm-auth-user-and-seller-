import { configureStore } from "@reduxjs/toolkit";
// import userReducer from './slices/UserSlice'
// import productReducer from "./slices/ProductSlice";
// import sellerReducer from "./slices/SellerSlice";

import userReducer from './slices/UserSlice'
import productReducer from "./slices/ProductSlice"
import sellerReducer from "./slices/SellerSlice"

export const store = configureStore({
  reducer: {
    user : userReducer,
    product: productReducer,
    seller: sellerReducer,
  },
});
