

const { PeerRPCClient }  = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')
const {CONSTANTS, OrderType, IOrder} = require('common')
const {request} = require('./request')

const link = new Link({
  grape: 'http://127.0.0.1:30001',
  requestTimeout: 10000
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()


// buyer price >= seller price Sale should happen.

const orders = [
    { 
        asset: 'BTC',
        price: 100,
        quantity: 5,
        type: OrderType.BUY,
        userId: '1'
    },
    { 
        asset: 'BTC',
        price: 80,
        quantity: 1,
        type: OrderType.BUY,
        userId: '3'
    },
    { 
        asset: 'BTC',
        price: 60,
        quantity: 5,
        type: OrderType.BUY,
        userId: '5'
    },
    {
        asset: 'BTC',
        price: 100,
        quantity: 5,
        type: OrderType.SELL,
        userId: '2'
    },
    {
        asset: 'BTC',
        price: 80,
        quantity: 3,
        type: OrderType.SELL,
        userId: '4'
    },
    {
        asset: 'BTC',
        price: 140,
        quantity: 3,
        type: OrderType.SELL,
        userId: '6'
    },
]

const sendRequest = async () => {
    try {
        for (let i = 0; i < orders.length; i++) {
            await request(peer, CONSTANTS.CREATE_ORDER_REQUEST, orders[i], { timeout: 100000 })
        }
        process.exit(0);
    } catch(err: any) {
        console.error(err)
        if (err.message === 'ERR_GRAPE_LOOKUP_EMPTY') {
            console.error('404 not found.')
            process.exit(0);
        }

    }
  
}

sendRequest()

