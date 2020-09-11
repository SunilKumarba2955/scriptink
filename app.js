const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
const app=express();


module.exports=firebase;

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));





//home route
app.get("/",function(req,res){
    res.render(__dirname+"/views/landing.ejs");
})


//category route
app.get("/:post",function(req,res){

    posts=[];
    var category=req.params.post;
    var categoryName,caption,image;

    if(category==="inspiration"){
         categoryName="Inspiration";
         caption="Grow Inspired";
         image="srk.jpg";

    }
    else if(category=="love"){
        categoryName="Love";
        caption="A Bliss Feeling";
        image="love.jpg";
    }
    else if(category=="sad"){
        categoryName="Sad";
        caption="Life shows it's way";
        image="sad1.jfif";
    }else{
        categoryName="Science";
        caption="Innovate with Science";
        image="space.jpg";
    }

    res.render(__dirname+"/views/posts.ejs",{category:categoryName,caption:caption,image:image});
    

})





app.listen("3000",function(){
     console.log("ScriptInk Website Is live on server 3000");
});
