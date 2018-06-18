let debug   = require('debug')('epmd:epmd');
let encoder = require('./epmd/encoder');
let decoder = require('./epmd/decoder');
let ErlangSocket = require('./ErlangSocket').ErlangSocket;

class EpmdConnection {
  static host_info(nodename) {
    let res = nodename.split('@');
    return {
      node: res[0],
      host: res[1] || '127.0.0.1'
    };
  }

  lookup_node(node_name) {
    this.node_info = EpmdConnection.host_info(node_name);
    let socket = new ErlangSocket('epmd');
    return new Promise((resolve, reject) => {
      socket.on('data', buffer => {
        let result = decoder.decodePortResponse(buffer);
        debug(`decoded response: ${JSON.stringify(result)}`);

        socket.close();
        result ? resolve({ port: result.data.port, name: result.data.name }) : reject('could not find node');
      });

      socket.connect(this.node_info.host)
        .then(() => debug('connected'))
        .then(() => socket.send(encoder.requestWrapper(encoder.requestPort(this.node_info.node))))
        .catch(reject)
    });
  }
}

exports.EpmdConnection = EpmdConnection;