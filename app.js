const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

//home route
app.get("/",function(req,res){
    res.sendFile(__dirname+"/landing.html");
})

app.listen("3000",function(){
     console.log("ScriptInk Website Is live on server 3000");
});