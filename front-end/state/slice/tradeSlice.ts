import { axiosInstance } from "@/lib/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  trades: [],
};

export const handlePlaceOrder = createAsyncThunk(
  "trade/placeOrder",
  async (payload: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/api/order", payload);
      console.log("Response : ", data);
      if (data.success) {
        toast.success(data.message, { position: "top-left", duration: 2500 });
      } else {
        toast.error(data.message, { position: "top-center", duration: 2500 });
      }
      return data;
    } catch (error: any) {
      console.log(error);

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
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
  },
});

export const { closeTrade } = tradeReducer.actions;
export default tradeReducer.reducer;
