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
	var participant = {'participantid': ''};
	//add participant which created the chat to it
	participant.participantid = next_part_id++;
	participants[participant.participantid] = participant;
	//create chat
	chat.vchatid = next_chat_id++;
	chat.participants = participants;
	chats[chat.vchatid] = chat;
	//response
	res.writeHead(200, {'result': true, 'id': chat.vchatid, 'uri': '/api/chats/'+ chat.vchatid});
	res.end(JSON.stringify(chat));
	return next();
});

//join chat method
server.post('/api/chats/:vchatid/participants', function (req, res, next) {
	var vchatid = parseInt(req.params.vchatid);
	//add participant which created the chat to it
	var participant = {'participantid': ''};
	participant.participantid = next_part_id++;
	participants[participant.participantid] = participant;
	chats[vchatid].participants = participants;
	res.writeHead(200, {'result': true, 'id': participant.participantid, 'uri': '/api/chats/'+vchatid+'/participants'});
	res.end(JSON.stringify(participant));
	return next();
});

//status method
server.get('/api/chats/:vchatid', function (req, res, next) {
	var vchatid = parseInt(req.params.vchatid);
	res.writeHead(200, {'result': true, 'id': 'vchatid', 'uri': '/api/chats/' + vchatid});
	res.end(JSON.stringify(true));
	return next();
});

//list participants method
server.get('/api/chats/:vchatid/participants', function (req, res, next) {
	res.writeHead(200, {'participants': participants});
	res.end(JSON.stringify(participants));
	return next();
});

//end chat method
server.post('/api/chats/:vchatid/end', function (req, res, next) {
	var vchatid = parseInt(req.params.vchatid);
	res.writeHead(200, {'result': true, 'id': 'vchatid', 'uri': '/api/chats/'+ vchatid +'/end'});
	res.end(JSON.stringify(true));
	return next();
});
