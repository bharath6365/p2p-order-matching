// Tried using https://github.com/bitfinexcom/grenache-nodejs-ws/blob/master/examples/sub.js
// but it didn't seem to connect. Going ahead with redis to save time. 

const redis = require('redis');
const {CONSTANTS} = require('common')
import {orderCreateListener, orderMatchListener} from '../../match-service/order-listener'
import { SERVICE_PORT } from '../../server/bootup';

export let subscriber;
export const initializeSubscriber = async () => {
  const client = redis.createClient();
  subscriber = client.duplicate();
  await subscriber.connect();

  subscriber.subscribe(CONSTANTS.ORDER_UPDATED, (payloadString) => {
    try {
        const payload = JSON.parse(payloadString);
        const {type, port, orderData} = payload;
        const {buyerOrder, sellerOrder, asset}  = orderData

        // Dont listen to your own events.
        if (port === SERVICE_PORT) {
          return;
        }

        orderMatchListener(buyerOrder, sellerOrder, asset);
    } catch(err) {
       console.error('Error in order full match listener', err)
    }
   
  });

  subscriber.subscribe(CONSTANTS.ORDER_CREATED, (payloadString) => {

    try {
        const payload = JSON.parse(payloadString);
        const {type,asset, port, orderData} = payload;

        //  Dont listen to your own events.
        if (port === SERVICE_PORT) {
          return;
        }

        orderCreateListener(orderData, asset);
    } catch(err) {
       console.error('Error in order create listener', err)
    }
  });
}

