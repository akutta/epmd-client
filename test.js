let Node = require('./node').Node;
let node = new Node('simulator', 'simulator')
node.rpc('th_thermostat', 'verify')
  .then(console.log)
  .catch(console.log)
  .then(process.exit)
