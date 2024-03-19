import { OrderStatus, type IOrder } from "common";
import { orderBook, sortOrdersByPrice } from "./order";
const {OrderType} = require('common');

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
    const existingOrder = orderBook[asset][type].find((existingOrder: IOrder) => existingOrder.id === order.id);
    if (existingOrder) {
       return;
    }

  
  
    orderBook[asset][type].push(order);
    sortOrdersByPrice(orderBook[asset][type], type === OrderType.BUY);

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
  
      const buyOrderIndex = buyOrders.findIndex((order: IOrder) => order.id === buyOrder.id);
      const sellOrderIndex = sellOrders.findIndex((order: IOrder) => order.id === sellOrder.id);

    // Validation
    if (buyOrderIndex === -1 || sellOrderIndex === -1) { 
        throw new Error('Order not found....');
    } 

    const oldBuyOrder = buyOrders[buyOrderIndex];
    const oldSellOrder = sellOrders[sellOrderIndex];

    // If the new order and old order, differ by more than 1 version, some update is missed. Handles double spending.
    // TODO: Figure out a  better way to correct these orders. No time to think of this usecase.
    if (buyOrder.version - oldBuyOrder.version > 1 || sellOrder.version - oldSellOrder.version > 1) {
        oldBuyOrder.status = OrderStatus.OUT_OF_SYNC;
        oldSellOrder.status = OrderStatus.OUT_OF_SYNC;

        orderBook[asset].BUY[buyOrderIndex] = oldBuyOrder;
        orderBook[asset].SELL[sellOrderIndex] = oldSellOrder;

        return
    }

    // Persist
    orderBook[asset].BUY[buyOrderIndex] = buyOrder;
    orderBook[asset].SELL[sellOrderIndex] = sellOrder;

  }



