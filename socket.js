let net          = require('net');
let EventEmitter = require('events').EventEmitter;
let debug        = require('debug')('epmd:socket');

class ErlangSocket extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }

  connect(host, port = 4369) {
    debug(`connecting to ${host}:${port}`);
    return new Promise((resolve, reject) => {
      try {
        this.client = net.connect({ host, port }, () => {
          debug(`connected to ${host}:${port}`);
          resolve();
        });
        this.client.on('data', this._onData.bind(this));
        this.client.on('end', this._onEnd.bind(this));
      } catch (err) {
        debug('unable to connect - ', err);
        reject(err);
      }
    });
  }

  close() {
    this.client.end();
    return Promise.resolve();
  }

  send(buffer) {
    this.client.write(buffer);
    return Promise.resolve();
  }

  _onData(data) {
    debug(`${this.name} - RECV`, data);
    this.emit('data', data);
  }

  _onEnd() {
    debug(`${this.name} - Connection Ended`);
    this.emit('closed');
  }
}

exports.ErlangSocket = ErlangSocket;