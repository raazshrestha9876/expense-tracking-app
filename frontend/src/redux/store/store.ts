import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/authSlice";
import expenseReducer from "../slices/expenseSlice";
import incomeReducer from "../slices/incomeSlice";
import { authApi } from "../services/authApi";
import { expenseApi } from "../services/expenseApi";
import { incomeApi } from "../services/incomeApi";

const rootReducer = combineReducers({
  auth: authReducer,
  expenses: expenseReducer,
  incomes: incomeReducer,
  [authApi.reducerPath]: authApi.reducer,
  [expenseApi.reducerPath]: expenseApi.reducer,
  [incomeApi.reducerPath]: incomeApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, expenseApi.middleware, incomeApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
