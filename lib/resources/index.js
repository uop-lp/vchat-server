module.exports = function(server, path) {
    require("./rooms")(server, path+"/rooms");
    //require("./authorization")(server, path+"/authorization");
};