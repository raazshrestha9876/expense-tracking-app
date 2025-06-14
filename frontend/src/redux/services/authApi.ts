import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "@/schema/user.schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";
import type { User } from "../types/auth";

type RegisterRequest = z.infer<typeof registerSchema>;
type LoginRequest = z.infer<typeof loginSchema>;
type UpdateUserRequest = z.infer<typeof updateProfileSchema>;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterRequest>({
      query: (newUser) => ({
        url: "/user/register",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: User;
      }) => response.data,
      invalidatesTags: ["User"],
    }),

    login: builder.mutation<void, LoginRequest>({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    getUser: builder.query<User, void>({
      query: () => ({
        url: "/user/get",
        method: "GET",
      }),
      transformResponse: (response: { success: boolean; data: User }) =>
        response.data,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (updateUser) => ({
        url: "/user/update",
        method: "POST",
        body: updateUser,
      }),
      transformResponse: (response: { success: boolean; data: User }) =>
        response.data,
      invalidatesTags: ["User"],
    }),
    updateUserPassword: builder.mutation<void, { password: string }>({
      query: (password) => ({
        url: "/user/update-password",
        method: "POST",
        body: password,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useUpdateUserPasswordMutation,
} = authApi;
