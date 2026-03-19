function checkMember (req, res, next) {
    const server = req.server;
    const userId = req.user.id;
  
    const isMember = server.members.find(
      (m) => m.user.toString() === userId
    );
  
    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this server",
      });
    }
  
    next();
};

module.exports ={
    checkMember
}