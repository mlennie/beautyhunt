var IP = process.env.MONGODB_PORT_27017_TCP_ADDR
var MONGOPORT = process.env.MONGODB_PORT_27017_TCP_PORT

module.exports = {
    url : 'mongodb://' + IP + ':' + MONGOPORT + '/' + 'beauty-dev',
    port: process.env.PORT || 8080
};