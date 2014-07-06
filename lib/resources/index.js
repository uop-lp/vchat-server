module.exports = function(server, root) {
//    var resources = ["rooms", "authorization"];
//    resources.forEach(function(path) {
//        require("./"+path)(server, root+path);
//    });


    require("./rooms")(server,root+"rooms");
//    require("./authorization")(server,root+"authorization");
};