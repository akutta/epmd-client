epmd-client
===========

Pure NodeJS Client that can send RPC calls to an Erlang node.

<pre>
    let Node = require('epmd-client').Node
    let node = new Node('simulator', 'simulator')
    node.rpc('module', 'function')
        .then(console.log)
</pre>


Credits
=======
https://github.com/mweibel/node-epmd-client