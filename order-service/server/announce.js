import { CONSTANTS } from "common"

export const register = (link, service) => {
    setInterval(() => {
       link.announce(CONSTANTS.CREATE_ORDER_REQUEST, service.port, {})
    }, 1000)
}