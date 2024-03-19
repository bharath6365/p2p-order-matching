import { CONSTANTS } from "common"

export const register = (link: any, service: any) => {
    setInterval(() => {
       link.announce(CONSTANTS.CREATE_ORDER_REQUEST, service.port, {})
    }, 1000)
}