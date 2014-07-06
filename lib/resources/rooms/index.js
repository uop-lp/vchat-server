module.exports = function(server, path) {
    var Room = server.model.types.Room;

    function serveRoom(req,res,next,room) {
        var self = path+"/"+room._id;
        var links = {
            "self": { "href": self },
            "participants": { "href": self+"/participants" }
        };
        res.links(links);

        res.send(200, {
            data: room,
            _links: links
        });
        next();
    }

    server.get(path+"/:rid", function(req,res,next){
        var rid = req.params.rid;
        Room.get(rid).then(function(room) {
            if(!room) {
                res.send(404);
                next();
            }
            else {
                serveRoom(req,res,next,room);
            }
        }, next);
    });
    server.post(path, function(req,res, next) {
        var room = new Room();
        room.created_at = new Date();
        room.status = "open";
        room.participants = [];

        server.model.save(room).then(function(){
            serveRoom(req,res,next,room);
        }, next);
    });
}