let constants = require('./constants');
let debug     = require('debug')('epmd:encoder');

exports.requestWrapper = req => {
  let baseLength = 2;
  let buf        = new Buffer(baseLength + req.length);
  buf.writeUInt16BE(req.length, 0);
  req.copy(buf, 2, 0);

  return buf;
};

exports.requestPort = node => {
  let nameLength = Buffer.byteLength(node, 'utf8') - 1;
  let req        = new Buffer(2 + nameLength);
  req.writeUInt8(constants.PORT_PLEASE2_REQ, 0);
  req.write(node, 1);
  return req;
};

exports.sendName = node => {
  let nameLength = Buffer.byteLength(node, 'utf8') - 1;
  let req        = new Buffer(7 + nameLength);

  req.writeUInt8(constants.NAMES_REQ, 0);
  req.writeUInt16BE(5, 1);
  req.writeUInt32BE(
    constants.DFLAG_EXTENDED_REFERENCES
    | constants.DFLAG_EXTENDED_PIDS_PORTS
    | constants.DFLAG_BIT_BINARIES
    | constants.DFLAG_NEW_FLOATS,
    3);
  req.write(node, 7);

  return this.requestWrapper(req);
};

exports.sendChallenge = (digest, challenge) => {
  let req = new Buffer(5);
  req.writeUInt8(constants.SEND_CHALLENGE_REPLY, 0);
  req.writeUInt32BE(challenge, 1);
  debug('send_challenge_reply: ', this.requestWrapper(Buffer.concat([req, digest])));
  return this.requestWrapper(Buffer.concat([req, digest]));
};