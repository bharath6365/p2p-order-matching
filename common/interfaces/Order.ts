export interface IOrder {
    type: OrderType;
    asset: string; 
    price: number;
    quantity: number;
    userId: string;
    
    id?: string; 
    createdOn?: Date; 
    updatedOn?: Date;
    version?: number;
    status?: OrderStatus 
    matchedWith?: Array<string>;
}

export enum OrderStatus {
    OPEN = 'OPEN',
    MATCHED = 'MATCHED',
    PARTIAL_MATCHED = 'PARTIAL_MATCHED',
    CANCELED = 'CANCELED'
}

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL'
}

export enum OrderMatchType {
    ORDER_FULL_MATCH_EVENT,
    ORDER_EXCESS_BUYER_MATCH_EVENT,
    ORDER_EXCESS_SELLER_MATCH_EVENT
}

export interface IOrderUpdate {
    type: OrderMatchType,
    orderData: {
        buyOrder: IOrder,
        sellOrder: IOrder,
        asset: string,
    },
    // TO make sure you don't listen to your own events.
    port: number
}