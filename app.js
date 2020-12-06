const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
const app=express();

var firebaseConfig = {
    apiKey: "AIzaSyAbM6QwPmIlHxSdLiWDjmWsyefmPiTl-bM",
    authDomain: "android-app-5c25d.firebaseapp.com",
    databaseURL: "https://android-app-5c25d.firebaseio.com",
    projectId: "android-app-5c25d",
    storageBucket: "android-app-5c25d.appspot.com",
    messagingSenderId: "862615088549",
    appId: "1:862615088549:web:6390609e12b6015a174c4c"
  };

  firebase.initializeApp(firebaseConfig);

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));





//home route
app.get("/",function(req,res){
    // var ref=firebase.database().ref("/Video");
    // ref.once('value').then(snap=>{
    //     console.log(snap.val());
    // })
    res.render("landing");
    
})

app.get("/members",(req,res)=>{
    res.render("members");
})


app.post("/getTeam",(req,res)=>{
    var member=[];
    var ref=firebase.database().ref("/Our Team");
    ref.once("value").then(snap=>{
        snap.forEach(element=>{
            member.push(element.val());
        })
        res.send({array:member});
    })
})


//category route
app.get("/:post",function(req,res){

    var posts=[];
    var backimg=[];
    var category=req.params.post;
    var categoryName,caption,image,back;

    if(category==="inspiration"){
         categoryName="Inspiration";
         caption="Grow Inspired";
         image="srk.jpg";
         back="inspiration.jpg";

    }
    else if(category=="love"){
        categoryName="Love";
        caption="A Bliss Feeling";
        image="love.jpg";
        back="loveback.jpg";
    }
    else if(category=="sad"){
        categoryName="Sad";
        caption="Life shows it's way";
        image="sad1.jfif";
        back="sadb.jpg";
    }else if(category=="science"){
        categoryName="Science";
        caption="Innovate with Science";
        image="space.jpg";
        back="spaceb.jpg";
    }else{
        res.send("Error 404");
    }
   
    res.render(__dirname+"/views/posts.ejs",{category:categoryName,caption:caption,image:image,back:back});
    
    

})

app.post("/getData",function(req,res){
     var type=req.body.type;
     var array=[];
     var backimg=[];
     var category=req.body.category;
     var ref=firebase.database().ref("/categories/"+category.toLowerCase()+"/"+type+"/writings/english");
     var ref1=firebase.database().ref("/categories/"+category.toLowerCase()+"/"+type+"/backimgurls/english");
     ref.once('value').then(snap=>{
         snap.forEach(element => {
             array.push(element.val());
         });
         ref1.once('value').then(snap1=>{
            snap1.forEach(element => {
                backimg.push(element.val());
            });
            res.send({array:array,backimg:backimg});
        });
     })
});



app.listen(process.env.PORT||3000,function(){
     console.log("ScriptInk Website Is live on server 3000");
});
