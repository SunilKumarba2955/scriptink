const express=require("express");
var nodemailer = require('nodemailer');
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
const app=express();
require('dotenv').config()


var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId:process.env.appId
  };
  
  firebase.initializeApp(firebaseConfig);
  

  
  app.use(cookieParser())
  app.use(csrf({ cookie: true }))
  
  app.set('view engine','ejs');
  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}));
  
  app.use(express.static(__dirname + '/public'));
  
  async function sendMail(type,email,name,androidLink,openRecitalLink,graphicLink) {
    try {
      const transport = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user:'scriptink.events@outlook.com',
          pass:'process.env.pass'
        },
      });
    var mailOptions;
      if(type==="writoFest"){
          mailOptions = {
            from: '"ScriptInk" <scriptink.events@outlook.com>',
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
      }else{
        mailOptions = {
            from: '"ScriptInk" <scriptink.events@outlook.com>',
            to: email, 
            subject: 'RAGE',
            html: `<p>Greetings ${name}<br><br>
            
            <b>Your details have been successfully registered for RAGE.</b><br>
            Follow following instructions:<br><br>

            ${androidLink}
            ${openRecitalLink}
            ${graphicLink}
            •Event will be hosted in a virtual environment on Cisco Webex Meetings.<br>
            •You will be provided with meetings details 24hrs before the beginning of event<br>
            •You can download our app from the following link:<br>
            https://play.google.com/store/apps/details?id=com.scriptink.official<br><br>
            
            For further information feel free to reach us anytime via following contacts:<br><br>

            For Android<br>
            Phone:+91-9380381379 <br><br>

            For After Effect <br>
            Phone:+91-8147019239 <br><br>

            For Open Mic<br>
            Phone:+91-9260927430<br><br>

            Email: reachscriptink@gmail.com<br>
            Phone: +91-80950-30481<br><br>
            
            We are open 24x7.<br><br>
            
            Team Scriptink </p>`
          };
      }
      
  
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }
  
  //home route
  app.get("/",function(req,res){
      res.render("landing",{csrfToken:req.csrfToken()});
  })
  

  var count;
  var participants;

  app.get("/registrationDetailsAll", (req,res)=>{
    
    count=0;
    participants=[];
    var ref = firebase.database().ref("Recruitments/Registrations/ViaWebsite");
     
     ref.once('value').then(snap=>{
          if(snap.val()!=null){
          snap.forEach(element=>{
            count++;
            participants.push(element.val());
        
          });
    
          participants.push({"Total : ":count});


          res.send(participants);
         
      }
    });

  })
  app.get("/getAndroidWeb", (req,res)=>{
    let array;
    participants= new Set();
    var ref = firebase.database().ref("Recruitments/Registrations/ViaWebsite");
     
     ref.once('value').then(snap=>{
          if(snap.val()!=null){
          snap.forEach(element=>{
            //   console.log(element.val());
            if(element.val().year==="2" ){
                element.val().IntersetedIn.forEach(ele=>{
                    console.log(ele);
                    if(ele==="androidDevelopment" || ele === "webDevelopment"){
                        participants.add(element.val().Email);
                    }
                })
              
            }
        
          });
    
          participants.add({"Total : ":count});
          array=[...participants];


          res.send(array);
         
      }
    });

  })




app.get("/getRageParticipantsEmail",(req,res)=>{
    var ref = firebase.database().ref("/Workshop/Registrations/ViaWebsite/All");
    var arr =[];
    ref.once('value').then(snap=>{
        snap.forEach(element => {
            arr.push(element.val().Email);
        });
        res.send(arr);
    })
  
})
  
  
const checkRecruitmentsRegistrationStart = (callback)=>{
    var ref = firebase.database().ref("/Recruitments");
    ref.once('value').then(snap=>{
        callback(snap.val().registrationstart);
    })
}
  
  
  const checkRegistrationStart = (callback)=>{
      var ref = firebase.database().ref("/WritoFest");
      ref.once('value').then(snap=>{
          callback(snap.val().registrationstart);
      })
  }

  const checkWorkshopRegistrationStart =(callback)=>{
    var ref = firebase.database().ref("/Workshop");
    ref.once('value').then(snap=>{
        // console.log(snap.val());
        callback(snap.val().registrationstart);
    })
  }
  

  const checkParticipants=(email,usn,url,callback)=>{
      var message="";
      var ref = firebase.database().ref(url);
     
      ref.once('value').then(snap=>{
          if(snap.val()!=null){
          snap.forEach(element=>{
              if(email===element.val().Email || usn===element.val().USN){
                   message="already exists";
              }
            });
            return callback(message);
      }else{
          return callback(message);
      }
      })
  }


  const  checkParticipantWorkshop=(email,usn,url,callback)=>{
    var message="";
    var key="";
    var ref = firebase.database().ref(url);
    ref.once('value').then(snap=>{
        if(snap.val()!=null){
        snap.forEach(element=>{
            // console.log(selected,element.val().OptedFor);
            if((email===element.val().Email || usn===element.val().USN) ){
                       message="already exists";
            }
          });
          return callback(message,key);
    }else{
        return callback(message,null);
    }
    })
}
  
  
  
  app.get("/team",(req,res)=>{
      res.render("members",{csrfToken:req.csrfToken()});
  })
  
  app.get("/event/WritoFest",(req,res)=>{
      res.render("event",{csrfToken:req.csrfToken()});
  })

  app.get("/event/RAGE",(req,res)=>{
    res.render("workshop",{csrfToken:req.csrfToken()});
})

  app.get("/registerWorkshop",(req,res)=>{
    res.render("registerWorkshop",{csrfToken:req.csrfToken()});
  })
  
  app.get("/register",(req,res)=>{
      res.render("register",{csrfToken:req.csrfToken()});
  })

  app.get("/recruitments",(req,res)=>{
    res.render("recruit",{csrfToken:req.csrfToken()});
})

app.post("/registerForRecruitments",(req,res)=>{
    var messageback="";
    var name=req.body.name;
    var usn=req.body.usn.toLowerCase();
    var email=req.body.email.toLowerCase();
    var phone=req.body.phone;
    var selected=req.body.selected;
    var year=req.body.year;

    // console.log(name,usn,email,phone,selected,year);
    var date=new Date();
  
    var ref = firebase.database().ref("/Recruitments/Registrations/ViaWebsite");
    checkRecruitmentsRegistrationStart((start)=>{
            
        if(start===1){
            checkParticipants(email,usn,`/Recruitments/Registrations/ViaWebsite`,(info,key)=>{
                // console.log(info);
                if(info === "already exists"){
                    messageback=info;
                    res.send({message:messageback});
                }else{
                    ref.child(`+91${phone}`).set({
                        Name:name,
                        Email:email,
                        USN:usn,
                        year:year,
                        "Phone Number":phone,
                        "Time of Registration":date.toString(),
                        "Date of Registration":date.toLocaleDateString(),
                        "IntersetedIn":selected
                    },(error)=>{
                        if(error){
                            res.send({message:"error"});
                        }else{
                            messageback="success";
                           
                            // sendMail("",email,name,androidLink,openRecitalLink,graphicLink)
                            // .then((result) =>{
                            //     console.log(result);
                            //     // return res.send({message:messageback});
                
                            // })
                            // .catch((error) =>{console.log(error.message)
                            //             //   res.send({message:messageback});
                            // });
                                
                            res.send({message:messageback});

                            
                        }
                    });
                
        


                
                }
            })
        }else{
            messageback="not started";
            res.send({message:messageback});
        }
    })

})

  
  app.post("/registerParticipants",(req,res)=>{
      var messageback="";
      var name=req.body.name;
      var usn=req.body.usn.toLowerCase();
      var email=req.body.email.toLowerCase();
      var phone=req.body.phone;
      var city=req.body.city;
      var college=req.body.college;
      var selected=req.body.selected;
     
      
        
         if(selected === ""){
             res.send({message:"checkbox not selected"});
         }
         else{
  
          var date=new Date();
  
          var ref = firebase.database().ref("/WritoFest/Registrations/WritoFest2021/ViaWebsite");
          
          var userkey = ref.push().key;
  
          checkRegistrationStart((start)=>{
              
              if(start===1){
                  checkParticipants(email,usn,"/WritoFest/Registrations/WritoFest2021/ViaWebsite",(info)=>{
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
                                  

                                  sendMail("writoFest",email,name,"","","")
                                        .then((result) =>{
                                            console.log(result);
                                            res.send({message:messageback});
                                        })
                                        .catch((error) =>{console.log(error.message)
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



  app.post("/registerForWorkshop",(req,res)=>{
    var messageback="";
    var name=req.body.name;
    var usn=req.body.usn.toLowerCase();
    var email=req.body.email.toLowerCase();
    var phone=req.body.phone;
    var city=req.body.city;
    var selected=req.body.selected;
    var year=req.body.year;
    var androidLink="";
    var openRecitalLink="";
    var graphicLink="";
    var recital=false;
     console.log(req.body);

        var date=new Date();

        var ref = firebase.database().ref("/Workshop/Registrations/ViaWebsite");
        var refCount = firebase.database().ref("/Workshop/Registrations/ViaWebsite/count");
        var userkey = ref.push().key;


        selected.forEach(element => {
            if(typeof(element)==="object"){
                    openRecitalLink="•Join WhatsApp Group for Open Mic <br>https://chat.whatsapp.com/DWTjK9EcJS5JsVXqkaW9V6<br>";
                    element.option.forEach(item => {
                        if(item!=="Audience"){
                            recital=true;
                        }
                    });
            }else {
                   if(element==="androidDevelopment"){
                            androidLink="•Join WhatsApp Group for Android Workshop <br>https://chat.whatsapp.com/BOthLS5csTCAZOa38R5XlF<br>";
                   }else{
                           graphicLink="•Join WhatsApp Group for After Effects Workshop <br>https://chat.whatsapp.com/Jb5EfWIGCt2GEOBfsIztlm<br>";
                   }
            }
        });



        checkWorkshopRegistrationStart((start)=>{
            
            if(start===1){
                checkParticipantWorkshop(email,usn,`/Workshop/Registrations/ViaWebsite/All`,(info,key)=>{
                    // console.log(info);
                    if(info === "already exists"){
                        messageback=info;
                        res.send({message:messageback});
                    // }else if(info === "different"){
                      
                    //     //   console.log(key);
                    //       ref.child(key).update({
                    //         "OptedFor":selected,
                    //         "Time of Registration":date.toString(),
                    //         "Date of Registration":date.toLocaleDateString(),
                    //       },(error)=>{
                    //         if(error){
                    //             res.send({message:"error"});
                    //         }else{
                    //             messageback="success";
                                

                    //             // const mailOptions = {
                    //             //     from: '"ScriptInk" <sender@email.com>',
                    //             //     to: email, 
                    //             //     subject: 'RAGE',
                    //             //     html: `<p>Greetings ${name}<br><br>
                                    
                    //             //     <b>Your details have been successfully updated for RAGE.</b><br>
                    //             //     Follow following instructions:<br><br>

                    //             //     ${androidLink}
                    //             //     ${openRecitalLink}
                    //             //     ${graphicLink}
                    //             //     •Event will be hosted in a virtual environment on Cisco Webex Meetings.<br>
                    //             //     •You will be provided with meetings details 24hrs before the beginning of event<br>
                    //             //     •You can download our app from the following link:<br>
                    //             //     https://play.google.com/store/apps/details?id=com.scriptink.official<br><br>
                                    
                    //             //     For further information feel free to reach us anytime via following Contacts:<br><br>
                                    
                    //             //     Email: reachscriptink@gmail.com<br>
                    //             //     Phone: +91-80950-30481<br><br>
                                    
                    //             //     We are open 24x7.<br><br>
                                    
                    //             //     Team Scriptink </p>`
                    //             //   };

                    //             //   transporter.sendMail(mailOptions, function (err, info) {
                    //             //     if(err){
                    //             //         console.log(err);
                    //             //       res.send({message:messageback});
                    //             //     }
                    //             //     else
                    //             //       res.send({message:messageback});
                    //             // });
                                    
                    //             // res.send({message:messageback});

                    //             sendMail("",email,name,androidLink,openRecitalLink,graphicLink)
                    //                     .then((result) =>{
                    //                         console.log(result);
                    //                         res.send({message:messageback});
                    //                     })
                    //                     .catch((error) =>{console.log(error.message)
                    //                                   res.send({message:messageback});
                    //                     });

                                
                    //         }
                    //     });
                      
                    }else{
                            var ref1;
                       if(recital===true){
                           ref1 =  ref.child("Performer").child(`+91${phone}`);
                           ref1.set({
                            Name:name,
                            Email:email,
                            USN:usn,
                            year:year,
                            "Phone Number":phone,
                            City:city,
                            "Time of Registration":date.toString(),
                            "Date of Registration":date.toLocaleDateString(),
                            "OptedFor":selected
                        },(error)=>{
                            if(error){
                                res.send({message:"error"});
                            }else{
                                ref.child("All").child(`+91${phone}`).set({
                                    Name:name,
                                    Email:email,
                                    USN:usn,
                                    year:year,
                                    "Phone Number":phone,
                                    City:city,
                                    "Time of Registration":date.toString(),
                                    "Date of Registration":date.toLocaleDateString(),
                                    "OptedFor":selected
                                },(error)=>{
                                    if(error){
                                        res.send({message:"error"});
                                    }else{
                                        messageback="success";
                                       
                                        sendMail("",email,name,androidLink,openRecitalLink,graphicLink)
                                        .then((result) =>{
                                                    console.log(result);
                                                //    return res.send({message:messageback});
                                          
                                        })
                                        .catch((error) =>{console.log(error.message)
                                                    //   res.send({message:messageback});
                                        });
                                            
                                        res.send({message:messageback});
        
                                        
                                    }
                                });
                            }});
                       }else{
                        ref.child("All").child(`+91${phone}`).set({
                            Name:name,
                            Email:email,
                            USN:usn,
                            year:year,
                            "Phone Number":phone,
                            City:city,
                            "Time of Registration":date.toString(),
                            "Date of Registration":date.toLocaleDateString(),
                            "OptedFor":selected
                        },(error)=>{
                            if(error){
                                res.send({message:"error"});
                            }else{
                                messageback="success";
                               
                                sendMail("",email,name,androidLink,openRecitalLink,graphicLink)
                                .then((result) =>{
                                    console.log(result);
                                    // return res.send({message:messageback});
                    
                                })
                                .catch((error) =>{console.log(error.message)
                                            //   res.send({message:messageback});
                                });
                                    
                                res.send({message:messageback});

                                
                            }
                        });
                    }
            


                    
                    }
                })
            }else{
                messageback="not started";
                res.send({message:messageback});
            }
        })
    
      
      
        
   
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
     
      res.render(__dirname+"/views/posts.ejs",{category:categoryName,caption:caption,image:image,back:back,csrfToken:req.csrfToken()});
      
      
  
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
  