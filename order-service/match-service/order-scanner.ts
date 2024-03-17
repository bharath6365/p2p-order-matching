
import { orderBook } from './order';
import { handleMatch, isMatchingOrders } from './order-matcher';

const {OrderStatus} = require('common');
const scannableListOfStatus: Array<string>  = [OrderStatus.OPEN, OrderStatus.PARTIAL_MATCHED];
const scanner = () => {

    for (const [assetSymbol, assetOrders] of Object.entries(orderBook)) {
        const buyOrders = assetOrders.BUY;
        const sellOrders = assetOrders.SELL;

        let buyIndex = 0;
        let sellIndex = sellOrders.length - 1;

        while (buyIndex < buyOrders.length && sellIndex >= 0) {
            const buyOrder = buyOrders[buyIndex];
            const sellOrder = sellOrders[sellIndex];

            // Match only OPEN, PARTIAL_MATCH orders
            if (scannableListOfStatus.includes(buyOrder.status) && scannableListOfStatus.includes(sellOrder.status)) { 
                if (buyOrder.price < sellOrder.price) {
                    // No potential price matches with the current sell order
                    buyIndex++;
                } else if (isMatchingOrders(buyOrder, sellOrder)) {
                    handleMatch(orderBook, assetSymbol, buyOrder, sellOrder, buyOrders, sellOrders, buyIndex, sellIndex);
                    buyIndex++; // Move to next buy order
                    sellIndex--; // Move to next lower-priced sell order
                } else {
                    // Need a lower priced sell order (or prices equal, but no full match)
                    sellIndex--; 
                }
            } else if (!scannableListOfStatus.includes(buyOrder.status)) {
                buyIndex++;  
            } else if (!scannableListOfStatus.includes(sellOrder.status)) {
                sellIndex--;
            } 
        }
    }
}

export const initializeOrderScanner = () => {
    setInterval(() => {
        scanner();
    }, 500);
}