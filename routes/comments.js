var express = require("express")
//campground is not being found as the id is not moving throught o the comment routes, therefore the the merge params is used.
var router = express.Router({mergeParams:true});
var camp = require("../models/campGrounds")
var  Comment = require("../models/comments")
var  middleware = require("../middleware")


router.get("/new", middleware.isLoggedIn,(req,res)=>{
    camp.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        }else{
      res.render("comments/new",{campground:foundCampground})
        }
  })
})


router.post("/", middleware.isLoggedIn, (req,res)=>{
    camp.findById(req.params.id, function(err,campground){
        if(err){
            req.flash("error", "something went wrong")
            console.log(err)
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err)
                }
                else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment)
                    req.flash("success","You have successfully added a comment")
                    res.redirect("/campgrounds/"+campground.id)
                }
            })
        }
        })
});

//edit route
router.get("/:comment_id/edit",  middleware.commentCheck,(req,res)=>{
Comment.findById(req.params.comment_id,(err,foundComment)=>{
    if(err){
        res.redirect("back")
    }else{
        res.render("comments/edit",{campground: req.params.id, comment:foundComment})
    }
})
   

})

//update route
router.put("/:comment_id", middleware.commentCheck, (req,res)=>{
Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
    if(err){
        console.log(err)
    }else{
        req.flash("success", "You have successfully updated the comment")
        res.redirect("/campgrounds/" +req.params.id)
    }
})
})

//delete route
router.delete("/:comment_id",middleware.commentCheck, (req,res)=>{
Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
    if (err){
        console.log(err)
    }else{
        req.flash("success", "Comment deleted")
        res.redirect("/campgrounds/" + req.params.id)
    }
})
})


module.exports = router;