const {user} = require("../models/users");
const{v4: uuidv4} = require("uuid");
const {setUser } = require('../service/auth')


async function handleUserSignUp(req,res){
    const body = req.body;
    await user.create({
        name: body.name,
        email: body.email,
        password: body.password,
    });
    return res.render("home");
}

async function handleUserLogin(req,res) {
    const body = req.body;
    const User = await user.findOne({email: body.email , password:body.password});
    if(!User) return res.render('login',{
        error: "invalid username or Password",
    });
    const sessionId = uuidv4();
    setUser(sessionId,User);
    res.cookie("uid", sessionId);
    return res.redirect("/");
}



module.exports= {handleUserSignUp,handleUserLogin
    };