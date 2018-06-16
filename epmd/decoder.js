let constants = require('./constants');
let debug     = require('debug')('epmd:decoder');

class DecoderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DecoderError';
  }
}

exports.getMessageType = buf => {
  let length = buf.readUInt8(0) + 2;
  let remainingBuffer = Buffer.from(buf, length);
  let type = buf.toString('utf8', 2, 3);
  debug('Message Type: ', type);
  return { type, length, buffer: Buffer.from(buf, 0, length), remainingBuffer }
};

exports.maybeParseStatusResponse = message => {
  if (message.type !== 's') {
    return null;
  }

  return message.buffer.toString('utf8', 3);
};

exports.decodePortResponse = buf => {
  let result = buf.readUInt8(1);
  if (result === 1) {
    return null;
  }
  if (result > 0) {
    throw new DecoderError(`EPMD returned an error. Result: "${result}"`);
  }

  let offset         = 2;
  let portNo         = buf.readUInt16BE(offset);
  offset += 2;
  let nodeType       = buf.readUInt8(offset);
  offset += 1;
  let protocol       = buf.readUInt8(offset);
  offset += 1;
  let highestVersion = buf.readUInt16BE(offset);
  offset += 2;
  let lowestVersion  = buf.readUInt16BE(offset);
  offset += 2;
  let nodeLength     = buf.readUInt16BE(offset);
  offset += 2;
  let nodeName       = buf.toString('utf8', offset, offset + nodeLength);
  offset             = offset + nodeLength;
  let elen           = buf.readUInt16BE(offset);
  offset             = offset + 2;
  let extra          = buf.slice(offset, elen);

  if (highestVersion < constants.LOWEST_VERSION) {
    throw new DecoderError('Highest protocol version returned lower than our lowest version');
  }
  if (lowestVersion > constants.HIGHEST_VERSION) {
    throw new DecoderError('Lowest protocol version provided higher than our highest version');
  }
  return {
    code: constants.PORT2_RESP,
    data: {
      nodeType: nodeType,
      protocol: protocol,
      port: portNo,
      name: nodeName,
      extra: extra
    }
  };
};