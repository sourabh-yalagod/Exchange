import React from "react";
interface Order {
  price: number;
  quantity: number;
  asset: string;
}
const OrderBook = ({ orderBook }: any) => {
  if (!orderBook) {
    return (
      <div className="w-full min-h-96 relative h-full border flex flex-col justify-center max-w-md mx-auto text-sm font-mono">
        <div className="absolute top-0 h-10 py-1 inset-x-0">
          <OrderBookHeader />
        </div>
        <div className="divide-y-1 mt-7 max-h-[300px] overflow-scroll"></div>
      </div>
    );
  }
  const sortedAsks = [...orderBook?.asks].sort((a, b) => a.price - b.price);
  const sortedBids = [...orderBook?.bids].sort((a, b) => b.price - a.price);

  const calculateCumulative = (orders: typeof orderBook.asks) => {
    let total = 0;
    return orders.map((order: Order) => {
      total += order.quantity;
      return { ...order, cumulative: total };
    });
  };

  const asksWithCumulative = calculateCumulative(sortedAsks);
  const bidsWithCumulative = calculateCumulative(sortedBids);

  return (
    <div className="w-full relative h-full border flex flex-col justify-center max-w-md mx-auto text-sm font-mono">
      <div className="absolute top-0 h-10 py-1 inset-x-0">
        <OrderBookHeader />
      </div>
      <div className="divide-y-1 mt-7 max-h-[300px] overflow-scroll">
        {asksWithCumulative?.map((ask: any, index: number) => (
          <div
            key={index}
            className={`flex justify-between px-2 py-1 ${
              index === 0 ? "bg-red-100 dark:bg-red-900" : ""
            }`}
          >
            <span className="text-red-600">{ask.price.toFixed(2)}</span>
            <span>{ask.quantity}</span>
            <span className="text-gray-400">{ask.cumulative}</span>
          </div>
        ))}
      </div>

      <div className="text-center my-1 border-y-[1px] text-xs text-gray-500">
        --- Spread ---
      </div>
      <div className="divide-y max-h-[300px] overflow-scroll">
        {bidsWithCumulative.map((bid: any, index: number) => (
          <div
            key={index}
            className={`flex justify-between px-2 py-1 ${
              index === 0 ? "bg-green-100 dark:bg-green-900" : ""
            }`}
          >
            <span className="text-green-600">{bid.price.toFixed(2)}</span>
            <span>{bid.quantity}</span>
            <span className="text-gray-400">{bid.cumulative}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderBookHeader = () => (
  <div className="flex justify-between font-bold border-b text-xs uppercase">
    <span>Price</span>
    <span>Qty</span>
    <span>Total</span>
  </div>
);

export default OrderBook;
