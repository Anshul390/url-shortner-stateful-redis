const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");


const {connectToMongoDB} = require("./connect");
const {URL} = require("./models/url");
const {restricToLoggedinUserOnly}= require("./middleware/auth")


const urlRoute = require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const port = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=> console.log('Mongodb connected'))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set('views',path.resolve("./views"));


app.use("/url",restricToLoggedinUserOnly, urlRoute);
app.use('/', staticRoute)
app.use("/user", userRoute);

app.listen(port, ()=>console.log("server connected"));

//in this we used stateful authenticatioin and it is memory intensive 
// and it also loses all logged in user when server restarts






// app.get("/test", (req,res)=>{
//     return res.render('home');
// })

// app.get('/:shortId',async (req,res)=>{
//     const shortId = req.params.shortId;
//     const entry = await URL.findOneAndUpdate({shortId}, {
//         $push:{visitHistory: {timestamp: Date.now()}},
//     })
//     res.redirect(entry.redirectURL);
// })