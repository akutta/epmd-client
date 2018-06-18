let EpmdConnection = require('./EpmdConnection').EpmdConnection;
let debug          = require('debug')('epmd:node');
let ErlangSocket   = require('./ErlangSocket').ErlangSocket;
let os             = require('os');
let encoder        = require('./epmd/encoder');
let decoder        = require('./epmd/decoder');
let NodeConnection = require('./NodeConnection').NodeConnection;
let epmd           = new EpmdConnection();

class ErlangNode {
  constructor(node, cookie) {
    this._cookie = cookie;
    this._node   = node;
  }

  // http://erlang.org/doc/apps/erts/erl_dist_protocol.html#id105392
  connect() {
    let info = EpmdConnection.host_info(this._node);
    debug(`host info: ${JSON.stringify(info)}`);
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject  = reject;
      this._maybeGetHost()
        .then(() => {
          debug(`connecting to erlang node - ${JSON.stringify(this._node_info)}`);
          this.socket = new ErlangSocket(info.node);
          this.socket.on('data', this._handleData.bind(this));
          return this.socket.connect(info.host, this._node_info.port)
            .then(() => this._send_node_name());
        });
    });
  }

  static _nodeName() {
    return `client@${os.hostname().split('.')[0]}`;
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

  _handleData(buffer) {
    let type   = decoder.getMessageType(buffer);
    let status = decoder.maybeParseStatusResponse(type);
    if (status) {
      this._handleStatus(status);
      return;
    }

    this.resolve(new NodeConnection(this.socket));
  }

  _send_node_name() {
    return this.socket.send(encoder.sendName(ErlangNode._nodeName()));
  }

  _handleStatus(status) {

  }
}

exports.Node = ErlangNode;