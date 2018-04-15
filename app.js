var express = require("express") ,
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride=require("method-override");

mongoose.connect("mongodb://localhost/blog_app");
 app.use(bodyParser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{
       type:Date,
       default:Date.now
   }
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({title:"first post",
// image:"https://upload.wikimedia.org/wikipedia/en/e/e5/Tokyo_Ghoul_volume_1_cover.jpg",
// body:"tokyoghoul:re has been started"},
// function(err,blog) {
//     if(err){
//         console.log(err);
//     }
// });

//==========ROUTES==============================


//========INDEX/ROOT===================


app.get("/",function(req,res){
   
//   res.send("hello");
   res.redirect("/blogs"); 
   
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } else{
          res.render("index",{blogs:blogs}); 
        //   console.log(blogs);
       }
    });
});

//=========NEW===================

app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});
// ========CREATE=================

app.post("/blogs",function(req, res) {
   Blog.create(req.body.blog,function(err){
       if(err){
           res.redirect("/blogs/new");
       }else{
           res.redirect("/blogs");
       }
   }) ;
});

//============SHOW ROUTE=============

app.get("/blogs/:id",function(req, res) {

    Blog.findById(req.params.id,function(err,foundblog){
       if(err){
           res.redirect("/blogs");
       } else
       {
         res.render("show",{blog:foundblog}); 
       }
    });
    
});


//===========EDIT=====================
app.get("/blogs/:id/edit",function(req, res) {
     Blog.findById(req.params.id,function(err,foundblog){
       if(err){
           res.redirect("/blogs");
       } else
       {
         res.render("edit",{blog:foundblog}); 
       }
    });
});

//============UPDATE=================
app.put("/blogs/:id",function(req,res){
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       if(err){
           console.log(err);
       }
       else{
           var showUrl = "/blogs/"+req.params.id;
           res.redirect(showUrl);
       }
   }) ;
});

//===========REMOVE=====================
app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/");
      }
      else{
          res.redirect("/");
      }
  }) ;

});


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("blogs app is on live"); 
});