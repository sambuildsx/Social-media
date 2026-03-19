function checkRole (allowedRoles) {
    return (req, res ,next) => {
        const server = req.server
        const userId = req.user.id;

        const member = server.members.find(
            (m) => m.user.toString() === userId 
        );

        if (!member || !allowedRoles.includes(member.role)){
            return res.status(403).json({
                message : "not allowed",
            })
        }

        next();
    };
};

module.exports = {
    checkRole
}