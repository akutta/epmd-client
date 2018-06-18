epmd-client
===========

Pure NodeJS Client that can send RPC calls to an Erlang node.

<pre>
    let Node = require('epmd-client').Node
    let node = new Node('simulator', 'simulator')
    node.connect()
      .then(conn => conn.rpc('th_thermostat', 'verify'))node.connect()
                                                          .then(conn => conn.rpc('th_thermostat', 'verify'))
</pre>


Credits
=======
https://github.com/mweibel/node-epmd-client
https://github.com/asynchrony/rinterface/tree/master/lib/rinterface
