const express=require("express");
var nodemailer = require('nodemailer');
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
const app=express();
require('dotenv').config()

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
  
  
  
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
             user: 'scriptink.writofest.2020@gmail.com',
             pass: process.env.PASS
         }
     });
  
  //home route
  app.get("/",function(req,res){
      res.render("landing");
  })


  
  var count1=0;
  var count2=0;
  var count3=0;
  var count4=0;
  var count5=0;
  var count6=0;
  var count7=0;
  var count8=0;
  var count9=0;
  var counts=0;
  var count16=0;
  var count17=0;
  var count18=0;
  var count19=0;
  var count=0;
  var participants;

  app.get("/registrationDetails",(req,res)=>{
      count=0;
    participants=[];
    var ref = firebase.database().ref("/WritoFest/Registrations/WritoFest2020/ViaWebsite");
     
      ref.once('value').then(snap=>{
          if(snap.val()!=null){
          snap.forEach(element=>{
            count++;
            participants.push(element.val());
              
              if(element.val().College.includes("Siddaganga") || element.val().College.includes("SIT") || element.val().College.includes("siddaganga") || element.val().College.includes("sit") || element.val().College.includes("Sit") || element.val().College.includes("SIDDAGANGA")){
                 counts++;
              }
              if(element.val().USN.includes("cs")||element.val().USN.includes("CS")){
                count1++;
              }
              if(element.val().USN.includes("is")||element.val().USN.includes("IS")){
                count2++;
             }
             if(element.val().USN.includes("ec")||element.val().USN.includes("EC")){
                count3++;
             }
             if(element.val().USN.includes("ee")||element.val().USN.includes("EE")){
                count4++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("TE")){
                count5++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("ET")){
                count6++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("EI")){
                count7++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("ME")){
                count8++;
             }
            if(element.val().USN.includes("ch")||element.val().USN.includes("CH")){
                count9++;
             }


            if(element.val().USN.toLowerCase().includes("1si16")){
                count16++;
            }
            if(element.val().USN.toLowerCase().includes("1si17")){
                count17++;
            }
            if(element.val().USN.toLowerCase().includes("1si18")){
                count18++;
            }
            if(element.val().USN.toLowerCase().includes("1si19")){
                count19++;
            }

          });
        //   console.log(count1 +" "+ count2+" "+ count3+" "+ count4+" "+ count5+" "+ count6+" "+ count7+" "+ count8+" ch: "+count9 );
        //   console.log("Total :"+counts+"  "+count);
        //   console.log("16- "+count16+" 17- "+count17+" 18- "+count18+" 19- "+count19);
          participants.push({"Total : ":count});
        //   console.log(participants);

          res.send(participants);
         

      }
      })

  })
  
  
  
  
  
  
  
  
  
  const checkRegistrationStart = (callback)=>{
      var ref = firebase.database().ref("/WritoFest");
      ref.once('value').then(snap=>{
          callback(snap.val().registrationstart);
      })
  }
  

  const checkParticipants=(email,usn,callback)=>{
      var message="";
      var ref = firebase.database().ref("/WritoFest/Registrations/WritoFest2020/ViaWebsite");
     
      ref.once('value').then(snap=>{
          if(snap.val()!=null){
          snap.forEach(element=>{
            count++;
              if(email===element.val().Email || usn===element.val().USN){
                   message="already exists";
              }
              if(element.val().College.includes("Siddaganga") || element.val().College.includes("SIT") || element.val().College.includes("siddaganga") || element.val().College.includes("sit") || element.val().College.includes("Sit") || element.val().College.includes("SIDDAGANGA")){
                 counts++;
              }
              if(element.val().USN.includes("cs")||element.val().USN.includes("CS")){
                count1++;
              }
              if(element.val().USN.includes("is")||element.val().USN.includes("IS")){
                count2++;
             }
             if(element.val().USN.includes("ec")||element.val().USN.includes("EC")){
                count3++;
             }
             if(element.val().USN.includes("ee")||element.val().USN.includes("EE")){
                count4++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("TE")){
                count5++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("ET")){
                count6++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("EI")){
                count7++;
             }
             if(element.val().USN.includes("te")||element.val().USN.includes("ME")){
                count8++;
             }
            if(element.val().USN.includes("ch")||element.val().USN.includes("CH")){
                count9++;
             }


            if(element.val().USN.toLowerCase().includes("1si16")){
                count16++;
            }
            if(element.val().USN.toLowerCase().includes("1si17")){
                count17++;
            }
            if(element.val().USN.toLowerCase().includes("1si18")){
                count18++;
            }
            if(element.val().USN.toLowerCase().includes("1si19")){
                count19++;
            }

          });
          console.log(count1 +" "+ count2+" "+ count3+" "+ count4+" "+ count5+" "+ count6+" "+ count7+" "+ count8+" ch: "+count9 );
          console.log("Total :"+counts+"  "+count);
          console.log("16- "+count16+" 17- "+count17+" 18- "+count18+" 19- "+count19);

            return callback(message);
      }else{
          return callback(message);
      }
      })
  }
  
  
  
  app.get("/team",(req,res)=>{
      res.render("members");
  })
  
  app.get("/event",(req,res)=>{
      res.render("event");
  })
  
  app.get("/register",(req,res)=>{
      res.render("register");
  })
  
  app.post("/registerParticipants",(req,res)=>{
      var messageback="";
      var name=req.body.name;
      var usn=req.body.usn;
      var email=req.body.email;
      var phone=req.body.phone;
      var city=req.body.city;
      var college=req.body.college;
      var selected=req.body.selected;
     
      
        
         if(selected === ""){
             res.send({message:"checkbox not selected"});
         }else{
  
          var date=new Date();
  
          var ref = firebase.database().ref("/WritoFest/Registrations/WritoFest2020/ViaWebsite");
          
          var userkey = ref.push().key;
  
          checkRegistrationStart((start)=>{
              
              if(start===1){
                  checkParticipants(email,usn,(info)=>{
                      // console.log(info);
                      if(info === "already exists"){
                          messageback=info;
                          res.send({message:messageback});
                      }else{
                          
                         
                          ref.child(userkey).set({
                              Name:name,
                              Email:email,
                              USN:usn,
                              "Phone Number":phone,
                              City:city,
                              College:college,
                              "Time of Registration":date.toString(),
                              "Date of Registration":date.toLocaleDateString(),
                              "Opted For":selected
                          },(error)=>{
                              if(error){
                                  res.send({message:"error"});
                              }else{
                                  messageback="success";
  
                                  const mailOptions = {
                                      from: '"ScriptInk" <sender@email.com>',
                                      to: email, 
                                      subject: 'WritoFest 2k20',
                                      html: `<p>Greetings ${name}<br><br>
                                      
                                      You have been successfully registered for WritoFest 2K20.<br>
                                      Follow following instructions:<br><br>
                                      
                                      •Event will be hosted in a virtual environment on Cisco Webex Meetings.<br>
                                      •You will be provided with meetings details 24hrs before the beginning of event<br>
                                      •Writing competition and submission will be taken via our android application<br>
                                      •You can download our app from the following link:<br>
                                      https://play.google.com/store/apps/details?id=com.scriptink.official<br><br>
                                      
                                      For further information feel free to reach us anytime via following Contacts:<br><br>
                                      
                                      Email: reachscriptink@gmail.com<br>
                                      Phone: +91-80950-30481<br><br>
                                      
                                      We are open 24x7.<br><br>
                                      
                                      Team Scriptink </p>`
                                    };
  
                                    transporter.sendMail(mailOptions, function (err, info) {
                                      if(err)
                                        res.send({message:messageback});
                                      else
                                        res.send({message:messageback});
                                  });
                                      
  
  
                                  
                              }
                          });
  
  
                      
                      }
                  })
              }else{
                  messageback="not started";
                  res.send({message:messageback});
              }
          })
      }
        
        
          
     
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
       if(category === "Science"){
           category="science fiction"
       }
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
  