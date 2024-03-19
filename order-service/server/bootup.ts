import Link  from 'grenache-nodejs-link'
import { PeerRPCServer, PeerPub } from 'grenache-nodejs-ws'

export let SERVICE_PORT: number | undefined;
export const bootup = () => {
    const link = new Link({
        grape: 'http://127.0.0.1:30001'
      })
      link.start()
      const peer = new PeerRPCServer(link, {})

      peer.init()
      const service = peer.transport('server')
      SERVICE_PORT = getRandomNumber(3000, 6000)
      service.listen(SERVICE_PORT) 
      console.log('server listening on', SERVICE_PORT)

      return {link, peer, service}

}

function getRandomNumber(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low)
}

