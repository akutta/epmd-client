let Node = require('./Node').Node;
let node = new Node('simulator', 'simulator');
node.connect()
  .then(conn => conn.rpc('th_thermostat', 'verify'))
  .then(console.log)
  .catch(console.log)
  .then(process.exit);
