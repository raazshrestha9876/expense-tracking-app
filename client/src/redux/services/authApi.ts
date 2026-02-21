import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from "@/schema/user.schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";
import type { User } from "../types/auth";

type RegisterRequest = z.infer<typeof registerSchema>;
type LoginRequest = z.infer<typeof loginSchema>;
type UpdateUserRequest = z.infer<typeof updateProfileSchema>;
type ForgetPasswordRequest = z.infer<typeof forgetPasswordSchema>;
type VerifyOptRequest = z.infer<typeof verifyOtpSchema>;

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

    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: User;
      }) => response.data,
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

    forgetPassword: builder.mutation<void, ForgetPasswordRequest>({
      query: (email) => ({
        url: "/user/forget-password",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOtp: builder.mutation<
      { success: boolean; message: string },
      VerifyOptRequest
    >({
      query: (otp) => ({
        url: "/user/forget-password/verify-otp",
        method: "POST",
        body: otp,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: { success: boolean; message: string }) => ({
        success: response.success,
        message: response.message,
      }),
    }),

    resetPassword: builder.mutation<void, { newPassword: string }>({
      query: (newPassword) => ({
        url: "/user/reset-password",
        method: "POST",
        body: newPassword,
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
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation
} = authApi;
