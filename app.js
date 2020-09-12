const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
const app=express();

var firebaseConfig = {
    apiKey: "AIzaSyCNbV3njDF6x-GNyT3-4v5z0gQ4LkWEbqk",
    authDomain: "scriptinktest.firebaseapp.com",
    databaseURL: "https://scriptinktest.firebaseio.com",
    projectId: "scriptinktest",
    storageBucket: "scriptinktest.appspot.com",
    messagingSenderId: "460801373887",
    appId: "1:460801373887:web:a90692f8f53d6df119f80a",
    measurementId: "G-GDD3MQCVXB"
  };
  firebase.initializeApp(firebaseConfig);

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));





//home route
app.get("/",function(req,res){
    res.render(__dirname+"/views/landing.ejs");
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
    }else{
        categoryName="Science";
        caption="Innovate with Science";
        image="space.jpg";
        back="spaceb.jpg";
    }
   
    res.render(__dirname+"/views/posts.ejs",{category:categoryName,caption:caption,image:image,back:back});
    
    

})

app.post("/getData",function(req,res){
     console.log(req.body);
     var type=req.body.type;
     var array=[];
     var backimg=[];
     var category=req.body.category;
     var ref=firebase.database().ref("/categories/"+category.toLowerCase()+"/"+type+"/writings/english");
     var ref1=firebase.database().ref("/categories/"+category.toLowerCase()+"/"+type+"/writings/backimgurl");
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



app.listen("3000",function(){
     console.log("ScriptInk Website Is live on server 3000");
});
