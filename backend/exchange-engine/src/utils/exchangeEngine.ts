import { RedisManager } from "../config/RediManager";

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
  public async lookUpOrderBook(order: Order) {
    let filledOrder = 0;
    let tradeMetaData: any = [];
    if (order.side === "bids") {
      const validOrders = this.orderBook.asks
        .filter((o) => o.price <= order.price)
        .sort((a, b) => a.price - b.price);

      const availableQuantity = validOrders.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      if (availableQuantity === 0) {
        return {
          filledOrder,
          message: `No matching asks available below the $${order.price}`,
          success: false,
        };
      }
      if (availableQuantity < order.quantity) {
        return {
          message: `only ${availableQuantity} quantity can be full filled as of now`,
          success: false,
          filledOrder,
        };
      }

      for (const o of validOrders) {
        if (order.quantity === 0) break;

        const index = this.orderBook.asks.findIndex(
          (ask) => ask.price === o.price && ask.quantity === o.quantity
        );

        if (index === -1) continue;

        const matched = this.orderBook.asks[index];
        tradeMetaData.push({
          buyerId: order.userId,
          sellerId: matched.userId,
          buyerOrderId: order.orderId,
          side: order.side,
          sellerOrderId: matched.orderId,
          price: matched.price,
          filled:
            Number(order.quantity) >=
            Number(this.orderBook.asks[index].quantity)
              ? true
              : false,
          asset: order.asset,
        });
        console.log(
          order.quantity,
          Number(this.orderBook.bids[index].quantity)
        );
        if (order.quantity <= matched.quantity) {
          matched.quantity -= order.quantity;
          filledOrder += order.quantity;
          if (matched.quantity === 0) {
            this.orderBook.asks.splice(index, 1);
          }
          order.quantity = 0;
        } else {
          order.quantity -= matched.quantity;
          filledOrder += matched.quantity;
          this.orderBook.asks.splice(index, 1);
        }
      }
      await this.publishToPubSub(order.asset);
      console.log("TradeMetaData : ", tradeMetaData);

      return {
        filledOrder,
        message: "order Filled",
        success: true,
        tradeMetaData,
      };
    }

    if (order.side === "asks") {
      const validOrders = this.orderBook.bids
        .filter((o) => o.price >= order.price)
        .sort((a, b) => b.price - a.price);

      const availableQuantity = validOrders.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );

      if (availableQuantity === 0) {
        return {
          filledOrder,
          message: `No matching Buyers available Above the $${order.price}`,
          success: false,
        };
      }
      if (availableQuantity < order.quantity) {
        return {
          message: `only ${availableQuantity} quantity can be full filled as of now`,
          success: false,
          filledOrder,
        };
      }
      for (const o of validOrders) {
        if (order.quantity === 0) break;

        const index = this.orderBook.bids.findIndex(
          (bid) => bid.price === o.price && bid.quantity === o.quantity
        );

        if (index === -1) continue;

        const matched = this.orderBook.bids[index];
        tradeMetaData.push({
          buyerId: matched.userId,
          sellerId: order.userId,
          buyerOrderId: order.orderId,
          side: order.side,
          sellerOrderId: matched.orderId,
          price: matched.price,
          filled:
            Number(order.quantity) >=
            Number(this.orderBook.bids[index].quantity)
              ? true
              : false,
          asset: order.asset,
        });
        console.log(
          order.quantity,
          Number(this.orderBook.bids[index].quantity)
        );

        if (order.quantity <= matched.quantity) {
          matched.quantity -= order.quantity;
          filledOrder += order.quantity;
          if (matched.quantity === 0) {
            this.orderBook.bids.splice(index, 1);
          }
          order.quantity = 0;
          break;
        } else {
          order.quantity -= matched.quantity;
          filledOrder += matched.quantity;
          this.orderBook.bids.splice(index, 1);
        }
      }
      await this.publishToPubSub(order.asset);
      return {
        filledOrder,
        message: `${filledOrder} quantities filled.`,
        success: true,
        tradeMetaData,
      };
    }

    return {
      filledOrder: 0,
      message: "Invalid order side" + order.side,
      success: false,
    };
  }
  public async handleOrders(order: Order) {
    this.count++;
    await RedisManager.getInstance().queue("order", JSON.stringify(order));
    const { success, filledOrder, message, tradeMetaData } =
      await this.lookUpOrderBook(order);
    if (success) {
      if (tradeMetaData) {
        await RedisManager.getInstance().publishToChannel(
          "trades",
          JSON.stringify(tradeMetaData)
        );
        for (const metadata of tradeMetaData)
          RedisManager.getInstance().queue("trades", JSON.stringify(metadata));
      }
      return { success, filledOrder, message };
    }
    if (order.side == "asks") {
      this.orderBook.asks.push(order);
    }
    if (order.side == "bids") {
      this.orderBook.bids.push(order);
    }

    await this.publishToPubSub(order.asset);
  }
  public async publishToPubSub(channel: string) {
    const pubSubMessageAsks = Object.values(
      this.orderBook.asks
        .sort((a: Order, b: Order) => a.price - b.price)
        .slice(0, 20)
        .reduce((acc, order) => {
          if (!acc[order.price]) {
            acc[order.price] = { price: order.price, quantity: 0 };
          }
          acc[order.price].quantity += order.quantity;
          return acc;
        }, {} as Record<number, { price: number; quantity: number }>)
    ).slice(0, 20);
    const pubSubMessageBids = Object.values(
      this.orderBook.bids
        .sort((a: Order, b: Order) => b.price - a.price)
        .slice(0, 20)
        .reduce((acc, order) => {
          if (!acc[order.price]) {
            acc[order.price] = { price: order.price, quantity: 0 };
          }
          acc[order.price].quantity += order.quantity;
          return acc;
        }, {} as Record<number, { price: number; quantity: number }>)
    ).slice(0, 20);
    await RedisManager.getInstance().publishToChannel(
      channel,
      JSON.stringify({ asks: pubSubMessageAsks, bids: pubSubMessageBids })
    );
  }
  public async process(order: Order) {
    if (order.type == "market") {
      return await this.lookUpOrderBook(order);
    } else {
      return await this.handleOrders(order);
    }
  }
}
