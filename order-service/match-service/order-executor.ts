import type { IOrder } from "common"

export const executeOrder = (order1: IOrder, order2: IOrder) =>{
    console.log('Order executed...', order1, order2)

    // Deduct from wallet, notify.
}