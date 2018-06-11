let constants = require('./constants');

exports.requestWrapper = req => {
  let baseLength = 2;
  let buf        = new Buffer(baseLength + req.length);
  buf.writeUInt16BE(req.length, 0);
  req.copy(buf, 2, 0);

  return buf;
};

exports.requestPort = node => {
  let baseLength = 2;
  let nameLength = Buffer.byteLength(node, 'utf8') - 1;
  let req        = new Buffer(baseLength + nameLength);
  let offset     = 0;
  req.writeUInt8(constants.PORT_PLEASE2_REQ, offset);
  offset = 1;
  req.write(node, offset);
  return req;
};