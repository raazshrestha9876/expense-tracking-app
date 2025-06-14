import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../types/auth";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setRegister: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    setLogin: (state) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLogout: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUpdatedUser: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    fetchUser: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setRegister,
  setLogin,
  setLogout,
  setUpdatedUser,
  fetchUser,
} = authSlice.actions;

export default authSlice.reducer;
