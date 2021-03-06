var camp = require("../models/campGrounds")
var Comment = require("../models/comments")
var middlewareObj = {};

middlewareObj.campgroundCheck = (req,res,next)=>{
    if(req.isAuthenticated()){
        camp.findById(req.params.id, (err,foundCampground)=>{
            if(err){
                req.flash("error","campground not found")
                res.redirect("/campgrounds")
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
           next();
                }else{
                   req.flash("error" , "You don't have permission to do that")
                    res.redirect("back")
                }
    }
    })
}   else{
    req.flash("error", "You need to be logged in to do that")
            res.redirect("back")
        }
}
middlewareObj.commentCheck = (req,res,next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You need to be logged in to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn =(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();}
        else{
            req.flash("error", "You need to be logged in to do that!!")
        res.redirect("/login")
        }
    }
module.exports = middlewareObj;