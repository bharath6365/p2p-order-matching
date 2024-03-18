const {promisify} = require('util')

const request = (peer: any, type: string, payload: any, configuration: any, callback: Function) => {
   peer.request(type, payload, configuration, (err, result) => {
      console.log('Action completed', type, 'Result', result, 'Error', err)
    callback(err, result)
   })
}

module.exports = {request: promisify(request)}