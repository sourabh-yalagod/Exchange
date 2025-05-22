import redis, { PubSubClients } from "../config/RediManager";

export class Engine {
  private orderBook: OrderBook = { asks: [], bids: [] };
  private balance: Map<string, UserBalance> = new Map();
  public static instance: Engine | null = null;
  private count = 0;
  private constructor() {}
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Engine();
    }
    return this.instance;
  }
  handleMarketOrders(order: Order) {
    const bookSide: Order[] =
      order.side === "bids" ? this.orderBook.asks : this.orderBook.bids;
    bookSide.sort((a: Order, b: Order) => a.price - b.price);
    for (let i = 0; i < bookSide.length && order.quantity > 0; i++) {
      const bookOrder = bookSide[i];
      if (
        (order.side === "bids" && order.price >= bookOrder.price) ||
        (order.side === "asks" && order.price <= bookOrder.price)
      ) {
        const tradedQty = Math.min(order.quantity, bookOrder.quantity);
        order.quantity -= tradedQty;
        bookOrder.quantity -= tradedQty;

        if (bookOrder.quantity === 0) {
          bookSide.splice(i, 1);
          i--; // since we removed the current one
        }
      }
    }
    if (order.quantity > 0) {
      console.log("Unfilled market order:", order);
    }
  }

  async handleLimitOrders(order: Order) {
    this.count++;
    if (order.side == "asks") {
      const isSamePriceOrderExist = this.orderBook.asks.findIndex(
        (o: Order) => o.price == order.price
      );
      if (isSamePriceOrderExist == -1) {
        this.orderBook.asks.push(order);
      } else {
        this.orderBook.asks[isSamePriceOrderExist].quantity += order.quantity;
      }
    }
    if (order.side == "bids") {
      const isSamePriceOrderExist = this.orderBook.bids.findIndex(
        (o: Order) => o.price == order.price
      );

      if (isSamePriceOrderExist == -1) {
        this.orderBook.bids.push(order);
      } else {
        this.orderBook.bids[isSamePriceOrderExist].quantity += order.quantity;
      }
    }
    console.log(this.count);
    const pubSubMessageAsks = this.orderBook.asks
      .sort((a: Order, b: Order) => a.price - b.price)
      .slice(0, 10)
      .map((order: Order) => {
        return { price: order.price, quantity: order.quantity };
      });
    const pubSubMessagebids = this.orderBook.bids
      .sort((a: Order, b: Order) => b.price - a.price)
      .slice(0, 10)
      .map((order: Order) => {
        return { price: order.price, quantity: order.quantity };
      });
    await PubSubClients.getInstance().publishToChannel(
      order.asset,
      JSON.stringify({ asks: pubSubMessageAsks, bids: pubSubMessagebids })
    );
  }
  public process(order: Order) {
    if (order.type == "market") {
      this.handleMarketOrders(order);
    } else {
      this.handleLimitOrders(order);
    }
  }
}
