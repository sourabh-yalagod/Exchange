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
  public async handleMarketOrders(order: Order) {
    let filledOrder = 0;

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

        if (order.quantity <= matched.quantity) {
          matched.quantity -= order.quantity;
          filledOrder += order.quantity;
          if (matched.quantity === 0) {
            this.orderBook.asks.splice(index, 1);
          }
          order.quantity = 0;
          break;
        } else {
          order.quantity -= matched.quantity;
          filledOrder += matched.quantity;
          this.orderBook.asks.splice(index, 1);
        }
      }
      await this.publishToPubSub(order.asset);

      return {
        filledOrder,
        message: "order Filled",
        success: true,
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
      };
    }

    return {
      filledOrder: 0,
      message: "Invalid order side" + order.side,
      success: false,
    };
  }
  public async handleLimitOrders(order: Order) {
    this.count++;
    const { success, filledOrder, message } = await this.handleMarketOrders(
      order
    );
    if (success) {
      return { success, filledOrder, message };
    }
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
    await this.publishToPubSub(order.asset);
  }
  public async publishToPubSub(channel: string) {
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
      channel,
      JSON.stringify({ asks: pubSubMessageAsks, bids: pubSubMessagebids })
    );
  }
  public async process(order: Order) {
    if (order.type == "market") {
      return await this.handleMarketOrders(order);
    } else {
      return await this.handleLimitOrders(order);
    }
  }
}
