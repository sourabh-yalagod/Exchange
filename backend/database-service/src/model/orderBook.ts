import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: String,
  price: Number,
  quantity: Number,
  asset: String,
  side: {
    type: String,
    enum: ['bids', 'asks'],
  },
  orderId: String,
  type: String,
  margin: Number,
});

const orderBookSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: true,
    unique: true,
  },
  bids: [orderSchema],
  asks: [orderSchema],
});
export const OrderBook = mongoose.models?.orderbook ?? mongoose.model('orderbook',orderBookSchema)