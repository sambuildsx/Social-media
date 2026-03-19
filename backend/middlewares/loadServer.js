const  Server = require ("../models/server");

module.exports = async function (req,  res, next) {
    const server = await Server.findById (req.params.serverId)

    if (!server) {
        return res.status(404).json({message : "Server not found"});
    }

    req.server = server;
    next();
}