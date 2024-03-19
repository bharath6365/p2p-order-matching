const {promisify} = require('util')

const request = (peer: any, type: string, payload: unknown, configuration: any, callback: Function) => {
   peer.map(type, payload, configuration, ((err: Error, result: unknown) => {
      callback(err, result)
   }))
}

module.exports = {request: promisify(request)}