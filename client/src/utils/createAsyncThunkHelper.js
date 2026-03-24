import axiosInstance from "./axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

const createApiThunk = (type, method, url) => {
  return createAsyncThunk(type, async (data, { rejectWithValue }) => {
    try {
      const config = {
        method,
        url: typeof url === "function" ? url(data) : url,
        data,
      };

      const response = await axiosInstance(config);
      return response?.data;

    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    }
  });
};

export default createApiThunk;