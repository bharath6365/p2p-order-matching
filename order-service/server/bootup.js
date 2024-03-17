import Link  from 'grenache-nodejs-link'
import { PeerRPCServer, PeerPub } from 'grenache-nodejs-ws'

export let port;
export const bootup = () => {
    const link = new Link({
        grape: 'http://127.0.0.1:30001'
      })
      link.start()
      const peer = new PeerRPCServer(link, {})

      peer.init()
      const service = peer.transport('server')
      port = 1337
      service.listen(port) 
      console.log('server listening on', port)

      return {link, peer, service}

}

