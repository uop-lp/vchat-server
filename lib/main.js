var Server = require("./server");
var server = Server.createServer({});

//listen at port number 3000
server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url)
});