import { orderBook } from "./order";

export const orderCreateListener = (order: any, asset: string) => {
    const {type} = order;

    const existingAsset = orderBook[asset];
    if (!existingAsset) {
      orderBook[asset] = {
          BUY: [],
          SELL: []
      }
    }
  
    orderBook[asset][type].push(order);

}

export const orderMatchListener = (buyOrder: any, sellOrder: any, asset: string) => {
      
      const existingAsset = orderBook[asset];
      if (!existingAsset) {
        orderBook[asset] = {
            BUY: [],
            SELL: []
        }
      }

      const buyOrders = orderBook[asset].BUY;
      const sellOrders = orderBook[asset].SELL; 
  
      // 2. Locate previous versions of the orders
      const prevBuyOrder = buyOrders.find((order: any) => order.id === buyOrder.id);
      const prevSellOrder = sellOrders.find((order: any) => order.id === sellOrder.id);
  
      // 3. Validation
      if (!prevBuyOrder || !prevSellOrder) {
        throw new Error('Order not found....');
      }

  

  
      // 5. Update in-memory orders
      prevBuyOrder.status = OrderStatus.MATCHED;
      prevSellOrder.status = OrderStatus.MATCHED;
      
  }