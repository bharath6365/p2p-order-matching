import { bootup } from './server/bootup.js'
import { register }  from './server/announce.js'
import { initializeRouter } from './server/router.js'
import { initializeOrderBook } from './match-service/order.js'
import { initializeOrderScanner } from './match-service/order-scanner.js'
import { initializePublisher } from './pubsub/publisher/bootup.js'
import { initializeSubscriber } from './pubsub/subscriber/bootup.js'

(async function() {
    const {peer, link, service} = bootup()

    // Service discovery.
    register(link, service);
    
    // Initialize order book and scanner.
    initializeOrderBook();
    initializeOrderScanner();
    
    // Initialize pub/sub
        
    initializePublisher();
    
    
    // Listening for incoming requests.
    initializeRouter(service);
    
    initializeSubscriber();
})()



