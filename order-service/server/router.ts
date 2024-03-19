import { registerOrder } from "../match-service/order"
import { CONSTANTS } from "common"

export const initializeRouter = (service: any) => {
    service.on('request', (rid: number, key: string, payload: unknown, handler: Function) => {
        if (key === CONSTANTS.CREATE_ORDER_REQUEST) {
           const order = registerOrder(payload)
           handler.reply(null, order)
        }
      })
}

