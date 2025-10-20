import { configureStore } from "@reduxjs/toolkit";
import { examPortalApi } from "./ApiSlice";

export const store = configureStore({
  reducer: {
    [examPortalApi.reducerPath]: examPortalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(examPortalApi.middleware),
});
