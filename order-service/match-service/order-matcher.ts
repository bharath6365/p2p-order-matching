

import { publisher } from '../pubsub/publisher/bootup';
import { port } from '../server/bootup';
import { executeOrder } from './order-executor'

const {OrderStatus, CONSTANTS} = require('common');
export const isMatchingOrders = (buyOrder: any, sellOrder: any): boolean => {
   return (
    buyOrder.price >= sellOrder.price &&
    sellOrder.asset === buyOrder.asset &&
    sellOrder.userId !== buyOrder.userId
   )
}

export const handleMatch = (orderBook: any, asset: string, buyOrder: any, sellOrder: any, buyOrders: any[], sellOrders: any[], buyIndex: number, sellIndex: number) => {
    
   // Handling full match.
   const buyOrderQuantity = buyOrder.quantity;
   const sellOrderQuantity = sellOrder.quantity;

   if (buyOrderQuantity === sellOrderQuantity) {
       handleFullMatch(orderBook, asset, buyOrder, sellOrder, buyOrders, sellOrders, buyIndex, sellIndex);
   } else if (buyOrderQuantity > sellOrderQuantity) {
         handlePartialMatchWithExcessBuy(orderBook, asset, buyOrder, sellOrder, buyOrders, sellOrders, buyIndex, sellIndex);
    } else {
        handlePartialMatchWithExcessSell(orderBook, asset, buyOrder, sellOrder, buyOrders, sellOrders, buyIndex, sellIndex);
    }

    executeOrder(buyOrder, sellOrder);
}

const handleFullMatch = (orderBook: any, asset: string, buyOrder: any, sellOrder: any, buyOrders: any[], sellOrders: any[], buyIndex: number, sellIndex: number) => {
    buyOrder.status = OrderStatus.MATCHED;
    buyOrder.version++;
    buyOrder.updatedOn = new Date();
    buyOrder.matchedWith.push(sellOrder.id);
    sellOrder.status = OrderStatus.MATCHED;
    sellOrder.updatedOn = new Date();
    sellOrder.matchedWith.push(buyOrder.id);
    sellOrder.version++;
    
    // Persist the changes back.
    buyOrders[buyIndex] = buyOrder;
    sellOrders[sellIndex] = sellOrder;
    orderBook[asset].BUY = buyOrders;
    orderBook[asset].SELL = sellOrders;

    // Pub, sub.
    const event = {
        type: CONSTANTS.ORDER_FULL_MATCH_EVENT,
        orderData: {
            buyOrder,
            sellOrder,
            asset
        },
        port: process.env.PORT,
    }
    publisher.publish(CONSTANTS.ORDER_UPDATED, JSON.stringify(event));
}

const handlePartialMatchWithExcessBuy = (orderBook: any, asset: string, buyOrder: any, sellOrder: any, buyOrders: any[], sellOrders: any[], buyIndex: number, sellIndex: number) => {
    // 1. Fulfill the sell order completely
    sellOrder.status = OrderStatus.MATCHED;
    sellOrder.version++;
    sellOrder.updatedOn = new Date();
    sellOrder.matchedWith.push(buyOrder.id);
    orderBook[asset].SELL = sellOrders; // Remove the fully matched sell order

    // 2. Adjust the buy order quantity
    buyOrder.quantity -= sellOrder.quantity; 
    buyOrder.version++;
    buyOrder.updatedOn = new Date();
    buyOrder.matchedWith.push(sellOrder.id);
    buyOrder.status = OrderStatus.PARTIAL_MATCHED
    buyOrders[buyIndex] = buyOrder; 

    orderBook[asset].BUY = buyOrders;

    // Pub sub.
    const event = {
        type: CONSTANTS.ORDER_EXCESS_BUYER_MATCH_EVENT,
        orderData: {
            buyOrder,
            sellOrder,
            asset
        },
        port: process.env.PORT,
    }
    publisher.publish(CONSTANTS.ORDER_UPDATED, JSON.stringify(event));
};

const handlePartialMatchWithExcessSell = (orderBook: any, asset: string, buyOrder: any, sellOrder: any, buyOrders: any[], sellOrders: any[], buyIndex: number, sellIndex: number) => {
    // 1. Fulfill the buy order completely
    buyOrder.status = OrderStatus.MATCHED;
    buyOrder.version++;
    buyOrder.updatedOn = new Date();
    buyOrder.matchedWith.push(sellOrder.id);
    orderBook[asset].BUY = buyOrders;

    // 2. Adjust the sell order quantity
    sellOrder.quantity -= buyOrder.quantity; 
    sellOrder.version++;
    sellOrder.updatedOn = new Date();
    sellOrder.matchedWith.push(buyOrder.id);
    sellOrder.status = OrderStatus.PARTIAL_MATCHED
    sellOrders[sellIndex] = sellOrder; 

    orderBook[asset].SELL = sellOrders;

    // Pub sub.
    const event = {
        type: CONSTANTS.ORDER_EXCESS_SELLER_MATCH_EVENT,
        orderData: {
            buyOrder,
            sellOrder,
            asset
        },
        port: process.env.PORT,
    }
    publisher.publish(CONSTANTS.ORDER_UPDATED, JSON.stringify(event));
}