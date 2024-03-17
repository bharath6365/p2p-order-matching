import { publisher } from "../pubsub/publisher/bootup"

const {IOrder, CONSTANTS} = require('common')

export interface IOrderBook {
    [assetSymbol: string]: {
        BUY: typeof IOrder[], // Sorted ascending by price
        SELL:typeof IOrder[], // Sorted descending by price
    }
}

// TODO: Fix typescript any,.
export let orderBook: any | null

export const initializeOrderBook = () => {
  if (!orderBook) {
    orderBook = {}
  }
}


export const registerOrder = (order: any) => {
   order.createdOn = new Date();
   order.updatedOn = new Date();
   order.status = 'OPEN';
   order.version = 1;
   order.id = Math.random().toString(36).substring(7);
   order.matchedWith = [];

   const {asset, price, quantity, type, userId} = order;
    
    if (!orderBook[asset]) {
        orderBook[asset] = {
            BUY: [],
            SELL: []
        }
    }

    if (type === 'BUY') {
        orderBook[asset].BUY.push(order);
        sortOrdersByPrice(orderBook[asset].BUY);
    } else {
        orderBook[asset].SELL.push(order);
        sortOrdersByPrice(orderBook[asset].SELL, false);
    }
    
    const payload = {
        type: CONSTANTS.ORDER_CREATED,
        orderData: order,
        port: process.env.port,
        asset
    }
    publisher.publish(CONSTANTS.ORDER_CREATED, JSON.stringify(payload))
    return order;

}

function sortOrdersByPrice(orders: any[], ascending: boolean = true) {
    orders.sort((a, b) => {
        if (ascending) {
            return a.price - b.price; 
        } else {
            return b.price - a.price; // Descending
        }
    });
}

setInterval(() => {
    console.log('Order Book', orderBook)
}, 3000)