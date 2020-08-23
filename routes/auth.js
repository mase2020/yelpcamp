var express = require("express")
var router = express.Router();
var passport = require("passport")
var User = require("../models/User")

    router.get("/register", (req, res)=>{
    res.render("register")
})
router.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,(err,user)=>{
                if (err){
                    req.flash("error", err.message)
                    res.render("register")
                    console.log(err);
                }else{
                    passport.authenticate("local", (req,res)=>{
                        req.flash("success","Welcome to YelpCamp" + user.username)
                    res.redirect("/campgrounds")
        })
    }
           
        })
});
router.get("/login",(req,res)=>{
    res.render("login");
})
router.post("/login",passport.authenticate("local",{
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }), (req,res)=>{})
router.get("/logout", (req,res) =>{
            req.logout();
            req.flash("success", "Logged you out")
            res.redirect("/")
}) 

module.exports = router;