const Server = require("../models/server");

async function createServer (req, res){
    const { name } = req.body;
    const server = await Server.create({
      name,
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "owner",
        },
      ],
    });

    res.status(201).json(server);
  } 


async function joinServer (req, res) {
    const server = req.server

    const alreadyMember = server.members.find(
        (m) => m.user.toString() === req.user.id
    );

    if (alreadyMember) {
        return res.status(400).json({ message: "Already joined" });
    }
    server.members.push({
        user: req.user.id,
        role: "member",
      });
    
      await server.save();
    
      res.json({ message: "Joined successfully" });
};

async function promoteMember (req, res){
    const { userId } = req.body;
    const server = req.server;
  
    const member = server.members.find(
      (m) => m.user.toString() === userId
    );
  
    if (!member) {
      return res.status(404).json({ message: "User not in server" });
    }
  
    member.role = "admin";
  
    await server.save();
  
    res.json({ message: "Promoted to admin" });
  };

  async function getServers(req, res) {

    try {
  
      const Server = require("../models/server");
  
      const servers = await Server.find({
        "members.user": req.user.id
      });
  
      res.json(servers);
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({
        message: "Server error"
      });
  
    }
  
  }
module.exports = {
  createServer,
  joinServer,
  promoteMember,
  getServers
};