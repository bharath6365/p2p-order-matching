import { registerOrder } from "../match-service/order"
import { CONSTANTS } from "common"

export const initializeRouter = (service) => {
    service.on('request', (rid, key, payload, handler) => {
        if (key === CONSTANTS.CREATE_ORDER_REQUEST) {
           const order = registerOrder(payload)
           handler.reply(null, order)
        }
      })
}

