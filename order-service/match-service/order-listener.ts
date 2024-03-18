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

    // Check if it's an existing order. Additional layer of safety.
    const existingOrder = orderBook[asset][type].find((existingOrder: any) => existingOrder.id === order.id);
    if (existingOrder) {
       return;
    }

  
  
    orderBook[asset][type].push(order);
    sortOrdersByPrice(orderBook[asset][type]);

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
  
      const buyOrderIndex = buyOrders.findIndex((order: any) => order.id === buyOrder.id);
      const sellOrderIndex = sellOrders.findIndex((order: any) => order.id === sellOrder.id);

    // Validation
    if (buyOrderIndex === -1 || sellOrderIndex === -1) { 
        throw new Error('Order not found....');
    } 

    const oldBuyOrder = buyOrders[buyOrderIndex];
    const oldSellOrder = sellOrders[sellOrderIndex];

    // If the new order and old order, differ by more than 1 version, some update is missed. Handles double spending.
    // TODO: Figure out a  better way to correct these orders. No time to think of this usecase.
    if (buyOrder.version - oldBuyOrder.version > 1 || sellOrder.version - oldSellOrder.version > 1) {
        oldBuyOrder.status = 'OUT_OF_SYNC';
        oldSellOrder.status = 'OUT_OF_SYNC';

        orderBook[asset].BUY[buyOrderIndex] = oldBuyOrder;
        orderBook[asset].SELL[sellOrderIndex] = oldSellOrder;

        return
    }

    // Persist
    orderBook[asset].BUY[buyOrderIndex] = buyOrder;
    orderBook[asset].SELL[sellOrderIndex] = sellOrder;

      
  }

