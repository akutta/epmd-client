class NodeConnection {
  constructor(socket) {
    this.socket = socket;
  }

  rpc(mod, fun, args) {
  }
}

exports.NodeConnection = NodeConnection;