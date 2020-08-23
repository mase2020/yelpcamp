var express = require("express")
var router = express.Router();
var camp = require("../models/campGrounds")
var  middleware = require("../middleware")

router.get("/", (req,res)=>{
    console.log(req.user);
     camp.find({}, function(err,camp){
            if(err){
                console.log(err)
            }
            else{
              //the first campgrounds is the name used in an ejs file as javascript. the second is what its referring to.
        res.render("campgrounds/index", {campgrounds:camp, currentUser: req.user});
            }
        });  
 });
router.post("/", middleware.isLoggedIn,(req,res)=>{
        //retreive the name and image url
        var name = req.body.name;
        var image = req.body.image;
        var description= req.body.description;
        var price = req.body.price
        var author ={
            id:req.user._id,
            username:req.user.username
        }
        var newCampground = {
            name: name,
            price:price,
            image: image,
            description: description,
            author: author
        };
      camp.create(
          newCampground
      ,(err,newCamp)=>{
          if(err){
              console.log(err)
          }
          else{
              console.log(newCamp)
              req.flash("success","You have successfully added a new campground")
               res.redirect("/campgrounds");
          };
    });
});
router.get("/new",middleware.isLoggedIn,(req,res)=>{
        res.render("campgrounds/new")
 })
router.get("/:id",(req,res)=>{
    camp.findById(req.params.id).populate('comments').exec( (err, foundCampground)=>{
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
})
//edit route
router.get("/:id/edit",middleware.campgroundCheck,(req,res)=>{
   
        camp.findById(req.params.id, (err,foundCampground)=>{
            if(err){
                res.redirect("/campgrounds")
            }else{
            res.render("campgrounds/edit", {campground: foundCampground});
                }
    })
})

//update route
router.put("/:id", middleware.campgroundCheck,(req,res)=>{
    camp.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
   
})
//delete route
router.delete("/:id", middleware.campgroundCheck,(req,res)=>{
    camp.findByIdAndRemove(req.params.id,(err)=>{
        if (err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    })
})



module.exports = router;