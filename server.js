var restify = require('restify'); //include restify module

//status of the participants
var next_part_id = 0;
var participants = {};
//status of chats
var next_chat_id = 0;
var chats = {};

//create the restify server for our vchat-api
var server = restify.createServer({ 
	name: 'vchat-api', 
	version: '0.0.1'
}); 

//listen at port number 3000 
server.listen(3000, function () { 
	console.log('%s listening at %s', server.name, server.url) 
});

//The operations to be implemented in this API

//create chat method
server.post('/api/chats', function (req, res, next) {
	//create the initial JSON for chat
	var chat = {
         'vchatid':'',
         'participants':[
            {
               'participantid': ''
            }
		]
           
	};
  chat.vchatid = next_chat_id++;
  chats[chat.vchatid] = chat;
  //add participant which created the chat to it
  var participant = req.params;
  participant.participantid = next_part_id++;
  participants[participant.id] = participant;
  chat.vchatid.participants = participants;
  //response
  res.writeHead(200, {'result': true, 'id': chat.id, 'uri': '/api/chats/'});
  res.end(JSON.stringify(chat));
  return next();
});

//join chat method
server.post('/api/chats/vchatid/participants', function (req, res, next) {
  var participant = req.params;
  participant.participantid = next_part_id++;
  participants[participant.participantid] = participant;
  res.writeHead(200, {'result': true, 'id': participant.participantid, 'uri': '/api/chats/vchatid/participants'});
  res.end(JSON.stringify(participant));
  return next();
});

//status method
server.get('/api/chats/vchatid', function (req, res, next) {
  res.writeHead(200, {'result': true, 'id': 'vchatid', 'uri': '/api/chats/vchatid'});
  res.end();
  return next();
});

//list participants method
server.get('/api/chats/vchatid/participants', function (req, res, next) {
  res.writeHead(200, {'participants': participants});
  res.end(JSON.stringify(participants));
  return next();
});

//end chat method
server.post('/api/chats/vchatid/end', function (req, res, next) {
  res.writeHead(200, {'result': true, 'id': 'vchatid', 'uri': '/api/chats/vchatid/end'});
  res.end();
  return next();
});


// Client
var client = restify.createJsonClient({
  url: 'http://localhost:3000',
  version: '~0.0'
});

client.post('/api/chats', { participantid: '0' }, function (err, req, res, obj) {
  if(err) console.log("An error ocurred:", err);
  else console.log('POST    /api/chats   returned: %j', obj);
  
  client.post('/api/chats/vchatid/participants',{ participantid: '0' }, function (err, req, res, obj) {
    if(err) console.log("An error ocurred:", err);
    else console.log('POST     /user/0 returned: %j', obj);
    
    client.get('/api/chats/vchatid', function (err, req, res, obj) {
      if(err) console.log("An error ocurred:", err);
      else console.log('GET     /api/chats/vchatid/participants returned: %j', obj);
      
      client.get('/api/chats/vchatid/participants', function (err, req, res, obj) {
        if(err) console.log("An error ocurred:", err);
        else console.log('GET  /api/chats/vchatid/participants returned: %j', obj);
        
        client.post('/api/chats/vchatid/end', function (err, req, res, obj) {
          if(err) console.log("An error ocurred:", err);
          else console.log('POST     /api/chats/vchatid/end returned: %j', obj);
        });
      });
    });
  });
});
