import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client";

//lofin thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ identifier, password, role }, thunkAPI) => {
    try {
      const data = { password };
      if (identifier.includes("@")) {
        data.email = identifier;
      } else {
        data.username = identifier;
      }

      const res = await api.post(
        `/auth/${role}/login`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "login failed"); /// if error.response is undefined return "login failed"

      //thunkAPI is an object that contains several methods and properties that can be used to interact with the Redux store and dispatch actions.
    }
  }
);

//register thunk
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ form, role }, thunkAPI) => {
    try {
      const res = await api.post(
        `/auth/${role}/register`,
        form,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Register failed"
      );
    }
  }
);




const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(
            loginUser.pending,
            (state) => { state.loading = true}
        )

        .addCase(
            loginUser.fulfilled,
            (state,action) => {
                state.loading = false,
                state.user = action.payload,
                state.isAuthenticated = true
            }
        )
          
        .addCase(
            loginUser.rejected,
            (state,action) =>{
                state.loading = false,
                state.error = action.payload
            }
        )


        .addCase(
            registerUser.fulfilled,
            (state,action) => {
                state.user = action.payload
                state.isAuthenticated = true
            }
        )
    }





})


export const {logout} = userSlice.actions
export default userSlice.reducer