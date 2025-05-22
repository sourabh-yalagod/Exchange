declare module "@sourabhyalagod/helper";

interface UserBalance {
  [key: string]: {
    available: number;
    locked: number;
  };
}
interface OrderBook {
  asks: Order[];
  bids: Order[];
}
interface Order {
  price: number;
  quantity: number;
  side: "asks" | "bids";
  asset: string;
  type: "limit" | "market";
  userId: string;
  orderId: number;
}
