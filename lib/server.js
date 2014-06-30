var restify = require('restify'); //include restify module
var pkginfo = require('pkginfo')(module);
var path = require("path");

var authenticate = require("./authenticate")

exports.createServer = function(options) {
    assert.object(options, 'options');
    assert.string(options.directory, 'options.directory');
    assert.object(options.log, 'options.log');

    //create the restify server for our vchat-api
    var server = restify.createServer({
        name: pkginfo.name,
        version: pkginfo.version
        //TODO: SSL certificate, logger (node-bunyan-winston)
    });

    // Ensure we don't drop data on uploads
    server.pre(restify.pre.pause());

    // Clean up sloppy paths like //item//////1//
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());

    // Set a per request bunyan logger (with requestid filled in) TODO: Handle logger
//    server.use(restify.requestLogger());

    // Allow 5 requests/second by IP, and burst to 10
    server.use(restify.throttle({
        burst: 10,
        rate: 5,
        ip: true
    }));

    // Use the common stuff you probably want
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());
    server.use(restify.bodyParser());

    server.use(function(req,res,next) {
        res.links = function(links) {
            var arr = [];
            for(var rel in links) {
                if(links.hasOwnProperty(rel)) {
                    arr.push("<"+links[rel]+">;rel=\""+rel+"\"");
                }
            }
            res.header("Link",arr.join(","));
        };
        next();
    });

    server.use(authenticate);


    var resources = require("./resources")(server, "/");

    return server;
};


//TODO: move into files...


//status of the participants
var next_part_id = 0;
var participants = {};
//status of chats
var next_chat_id = 0;
var chats = {};

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
