import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../config.js";
console.log(config.API_URL)
export const examPortalApi = createApi({
  reducerPath: "examPortalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Users", "Forms", "Submissions", "Payments"],

  endpoints: (builder) => ({
    // ---------------- USERS MODULE ----------------

    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),
        invalidatesTags: ["Users"],
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    getUserById: builder.query({
      query: (id) => `/users?userId=${id}`,
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // ---------------- FORMS MODULE ----------------

    getAllForms: builder.query({
      query: () => "/forms",
      providesTags: ["Forms"],
    }),

    createForm: builder.mutation({
      query: (formData) => ({
        url: "/forms/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Forms"],
    }),

    getFormById: builder.query({
      query: (id) => `/forms?formId=${id}`,
      providesTags: ["Forms"],
    }),

    updateForm: builder.mutation({
      query: ({ id, data }) => ({
        url: `/forms/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Forms"],
    }),

    deleteForm: builder.mutation({
      query: (id) => ({
        url: `/forms/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Forms"],
    }),

    // ---------------- SUBMISSIONS MODULE ----------------

    getAllSubmissions: builder.query({
      query: () => "/submission",
      providesTags: ["Submissions"],
    }),

    getUserSubmissions: builder.query({
      query: (userId) => `/submission?userId=${userId}`,
      providesTags: ["Submissions"],
    }),

    submitExamForm: builder.mutation({
      query: (data) => ({
        url: "/submission/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Submissions"],
    }),

    updateSubmissionStatus: builder.mutation({
      query: ({ id, status, remarks }) => ({
        url: `/submission/update/${id}`,
        method: "PUT",
        body: { status, remarks },
      }),
      invalidatesTags: ["Submissions"],
    }),

    deleteSubmission: builder.mutation({
      query: (id) => ({
        url: `/submission/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Submissions"],
    }),

    // ---------------- PAYMENTS MODULE ----------------

    getAllPayments: builder.query({
      query: () => "/payments",
      providesTags: ["Payments"],
    }),

  
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments/create",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payments"],
    }),

      verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments/verify",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payments"],
    }),

    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  // USERS
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // FORMS
  useGetAllFormsQuery,
  useCreateFormMutation,
  useGetFormByIdQuery,
  useUpdateFormMutation,
  useDeleteFormMutation,

  // SUBMISSIONS
  useGetAllSubmissionsQuery,
  useGetUserSubmissionsQuery,
  useSubmitExamFormMutation,
  useUpdateSubmissionStatusMutation,
  useDeleteSubmissionMutation,

  // PAYMENTS
  useGetAllPaymentsQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useVerifyPaymentMutation
} = examPortalApi;
