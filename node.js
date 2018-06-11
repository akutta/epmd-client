let EpmdConnection = require('./epmd').EpmdConnection;
let epmd           = new EpmdConnection();
let net            = require('net');

class Node {
  constructor(node, cookie) {
    this._cookie    = cookie;
    this._node_info = epmd.lookup_node(node);
    this._node      = node;
  }

  rpc(mod, fun, args) {
    let info = EpmdConnection.host_info(this._node);

  }
};

exports.Node = Node;