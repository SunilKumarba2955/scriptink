const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
var posts=[];
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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));





//home route
app.get("/",function(req,res){
    res.sendFile(__dirname+"/landing.html");
})

app.get("/:post",function(req,res){

    posts=[];
    console.log(req.params.post)
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

    var ref= firebase.app().database().ref('categories/'+categoryName.toLowerCase()+'/quotes/writings/english');
    ref.once('value').then(snap=> {
           snap.forEach(element => {
               posts.push(element.val());
           });
           res.render("posts.ejs",{category:categoryName,caption:caption,image:image,posts:posts});
    })
    
   

    


})




app.listen("3000",function(){
     console.log("ScriptInk Website Is live on server 3000");
});
