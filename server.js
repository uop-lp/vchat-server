var restify = require('restify'); //include restify module
//create the restify server for our vchat-api

var server = restify.createServer({ 
name: 'vchat-api' 
version: 0.0.1
}); 

//listen at port number 3000 
server.listen(3000, function () { 
  console.log('%s listening at %s', server.name, server.url) 
});

//The operations to be implemented in this API
//server.get();
//server.put();
//server.post();
//server.del();
