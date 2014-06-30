module.exports = function(server, path) {
    server.get(path+"/:rid", function(req,res,next){
        var rid = req.params.rid;
        var room = {
            id: rid,
            "created_at": "2014-04-14T02:15:15Z",
            "status": "open",
            "participants": []
        };
        var self = path+"/"+rid;
        room._links = {
            "self": { "href": self },
            "participants": { "href": self+"/participants" }
        };
        res.links(room._links);

        res.send(200, room);
    });
}