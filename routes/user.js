const express = require("express");
const {handleUserSignUp, handleUserLogin}= require("../controllers/user2auth")
const router = express.Router();

router.post("/", handleUserSignUp );

router.post("/login",handleUserLogin);

//const {user} = require("../models/users");

module.exports = router;