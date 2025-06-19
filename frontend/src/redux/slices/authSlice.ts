import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../types/auth";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    fetchUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLogin, setLogout, fetchUser } = authSlice.actions;

export default authSlice.reducer;
