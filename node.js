let EpmdConnection = require('./epmd').EpmdConnection;
let epmd           = new EpmdConnection();
let debug          = require('debug')('epmd:node');
let ErlangSocket   = require('./socket').ErlangSocket;

class Node {
  constructor(node, cookie) {
    this._cookie = cookie;
    this._node   = node;
  }

  rpc(mod, fun, args) {
    let info = EpmdConnection.host_info(this._node);
    debug(`host info: ${JSON.stringify(info)}`);
    return this._maybeGetHost()
      .then(() => {
        debug(`connecting to erlang node - ${JSON.stringify(this._node_info)}`);
        this.socket = new ErlangSocket();
        this.socket.on('data', this._handleResponse);
        return this.socket.connect(info.host, this._node_info.port)
          .then(() => this._send_node_name())
      });
  }

  _handleResponse(buffer) {
    debug('RECV', buffer);
  }

  _maybeGetHost() {
    return new Promise((resolve, reject) => {
      if (!this._node_info) {
        console.log('getting host');
        return epmd.lookup_node(this._node).then(node_info => {
          this._node_info = node_info;
          debug(`${this._node} found on ${node_info.port}`);
        })
          .then(resolve)
          .catch(reject);
      }
      resolve();
    });
  }

  _send_node_name() {

  }
}

exports.Node = Node;