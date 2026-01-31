const {getUesr} = require("../service/auth2")

async function restricToLoggedinUserOnly(req,res,next) {
    const userUid = req.cookies?.uid;

    if(!userUid) return res.redirect("/login");

    const user = getUesr(userUid)
    if(!user ) return res.redirect("/login");

    req.user = user;
    next();
}

module.exports= {
    restricToLoggedinUserOnly,
}