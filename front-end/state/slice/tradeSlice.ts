import { axiosInstance } from "@/lib/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
const initialState = {
  trades: [],
};

export const handlePlaceOrder = createAsyncThunk<
  any,
  any,
  { extra: { queryClient: QueryClient } }
>("trade/placeOrder", async (payload: any, thunkAPI) => {
  const { queryClient } = thunkAPI.extra;
  try {
    const { data } = await axiosInstance.post("/api/order", payload);
    console.log("Response : ", data);
    if (data.success) {
      toast.success(data.message, {
        position: "top-left",
        duration: 2500,
        style: {
          background: "#68cc1b",
          color: "#fffff",
          border: "1px solid #68cc10",
        },
        className: "font-medium text-sm",
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } else {
      toast.error(data.message || "Something went wrong", {
        position: "top-center",
        duration: 2500,
        style: {
          background: "#cc381b",
          color: "#fffff",
          border: "1px solid #fca5a5",
        },
        className: "font-medium text-sm",
      });
    }
    return data;
  } catch (error: any) {
    console.log(error);

    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const handleCloseTrade = createAsyncThunk<
  any,
  any,
  { extra: { queryClient: QueryClient } }
>("trade/close", async (payload: any, thunkAPI) => {
  try {
    const { queryClient } = thunkAPI.extra;
    const { data } = await axiosInstance.post(
      `/api/database/order/close/${payload.orderId}`,
      payload
    );
    console.log("close order", data);

    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    toast(data?.message, { duration: 2000 });
    return data;
  } catch (error) {
    toast.error(`Order closing failed...!`, {
      description: "Please try it again",
    });
  }
});
export const tradeReducer = createSlice({
  name: "trade",
  initialState,
  reducers: {
    closeTrade: (state: any, action) => {
      const { tradeId } = action.payload;
      state.trades = state.trades.filter(
        (trade: any) => trade.orderId != tradeId
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handlePlaceOrder.fulfilled, (state: any, action: any) => {
      if (action.payload.success) {
        state.trades.push(action.payload);
      }
    });
    builder.addCase(handleCloseTrade.fulfilled, (state: any, action) => {
      console.log(action.payload);
    });
  },
});

export const { closeTrade } = tradeReducer.actions;
export default tradeReducer.reducer;
