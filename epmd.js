let net     = require('net');
let debug   = require('debug')('epmd:epmd');
let encoder = require('./epmd/encoder');
let decoder = require('./epmd/decoder');

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
    return new Promise((resolve, reject) => {
      this.client  = net.connect({
        host: this.node_info.host,
        port: 4369
      }, () => {
        let request = encoder.requestWrapper(encoder.requestPort(this.node_info.node));
        debug('requesting port', request);
        this.client.write(request);
      });
      this.resolve = resolve;
      this.reject  = reject;
      this.client.on('data', this._onData.bind(this));
      this.client.on('end', this._onEnd.bind(this));
    });
  }

  _onData(data) {
    debug('RECV', data);
    let result = decoder.decodePortResponse(data);
    debug(`decoded response: ${JSON.stringify(result)}`);

    this.client.end();
    result ? this.resolve({ port: result.data.port, name: result.data.name }) : this.reject('could not find node');
  }

  _onEnd() {
    debug('Connection Ended');
  }

}

exports.EpmdConnection = EpmdConnection;