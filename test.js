var restify = require('restify'); //include restify module

// Client to test our server
var client = restify.createJsonClient({
	url: 'http://localhost:3000',
	version: '~0.0'
});

client.post('/api/chats', { participantid: '0' }, function (err, req, res, obj) {
  if(err) console.log("An error occurred:", err);
  else console.log('POST    /api/chats   returned: %j', obj);
  
  client.post('/api/chats/0/participants', function (err, req, res, obj) {
    if(err) console.log("An error occurred:", err);
    else console.log('POST     /api/chats/0/participants returned: %j', obj);
    
    client.get('/api/chats/0', function (err, req, res, obj) {
      if(err) console.log("An error occurred:", err);
      else console.log('GET     /api/chats/0/participants returned: %j', obj);
      
      client.get('/api/chats/0/participants', function (err, req, res, obj) {
        if(err) console.log("An error occurred:", err);
        else console.log('GET  /api/chats/0/participants returned: %j', obj);
        
        client.post('/api/chats/0/end', function (err, req, res, obj) {
          if(err) console.log("An error occurred:", err);
          else console.log('POST     /api/chats/0/end returned: %j', obj);
        });
      });
    });
  });
});
