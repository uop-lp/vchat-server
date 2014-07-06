var couchbase = require('couchbase');
var Ottoman = require("ottoman");
var Q = require("q");



var bucket = new couchbase.Connection({host: 'localhost:8091', bucket: 'vchat'}); //TODO: move to parameter, from configuration

var models = [/*"Authentication",*/"Room"];
var types = module.exports.types = {};
models.forEach(function(name) {
    var info = require("./"+name);
    info.options = info.options || {};
    info.options.bucket = bucket;

    var model = Ottoman.model(name, info.schema, info.options);
    model.get = function() {
        return Q.denodeify(model.findById.bind(model)).apply(this,arguments).then(null, function(err) {
            if(err && err.code === couchbase.errors.keyNotFound) {
                return null;
            }
        });
    }
    types[name] = model;
});


var _bind = function(name) {
    return Ottoman[name].bind(Ottoman);
};

var _save = Q.denodeify(_bind("save"));
module.exports.save = function(obj) {
    return _save(obj);
};