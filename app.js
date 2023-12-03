const express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const firebase = require("firebase");
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const Razorpay = require('razorpay');
const sha256 = require('js-sha256');
const Email = require('email-templates');
const path = require('path');

const app = express();

require('dotenv').config()




var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

const razorpay = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
})

firebase.initializeApp(firebaseConfig);



app.use(cookieParser())
app.use(csrf({ cookie: true }))

app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

async function sendMail(type, email, name, usn, razorpay_id, androidLink, openRecitalLink, graphicLink) {
    try {


        const createTransporter = async () => {
            const oauth2Client = new OAuth2(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                "https://developers.google.com/oauthplayground"
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN
            });

            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                    if (err) {
                        console.log(err);
                        reject("Failed to create access token :(");
                    }
                    resolve(token);
                });
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL,
                    accessToken,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN
                }
            });

            return transporter;
        };

        var mailOptions;
        if (type === "writoFest") {
            var transport = await createTransporter();
            mailOptions = new Email({
                transport: transport,
                send: true,
                preview: false,
                views: {
                    options: {
                        extension: 'ejs',
                    },
                    root: './views/',
                },
            });

        } else {
            mailOptions = {
                from: '"ScriptInk" <scriptink.events@zohomail.in>',
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


        const result = await mailOptions.send({
            template: path.join(__dirname, 'views', 'template'),
            message: {
                from: '"ScriptInk" <scriptink.writofest.2020@gmail.com>',
                to: email,
                subject: 'WritoFest 2k22 ',
                attachments: [{
                    filename: 'scriptwbg.png',
                    path: 'public/images/logo_bg.png',
                    cid: 'logo' //same cid value as in the html img src
                }, {
                    filename: 'ticket.jpg',
                    path: 'public/images/bg14new.jpg',
                    cid: 'back' //same cid value as in the html img src   
                }]
            },
            locals: {
                name: name,
                razorpay_id: razorpay_id,
                usn: usn
            }
        })
        //   transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//home route
app.get("/", function (req, res) {
    res.render("landing", { csrfToken: req.csrfToken() });
})


var count;
var participants;

app.get("/registrationDetailsAll", (req, res) => {

    count = 0;
    participants = [];
    var todate = new Date().getFullYear();
    var ref = firebase.database().ref(`/Recruitments/Registrations/${todate}/ViaWebsite`);

    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                count++;
                participants.push(element.val());
            });
            console.log(participants.length);
            res.send({ participants: participants, "Total": participants.length });
        }
    });

})

app.get("/registrationDetailsOut", (req, res) => {

    count = 0;
    participants = [];
    var ref = firebase.database().ref("WritoFest/Registrations/WritoFest2022/ViaWebsite");

    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                if (element.val().College !== "Siddaganga Institute of Technology") {
                    count++;
                    participants.push(element.val());
                }

            });

            participants.push({ "Total : ": count });


            res.send(participants);

        }
    });

})

app.get("/registrationDetails20", (req, res) => {

    count = 0;
    participants = [];
    var ref = firebase.database().ref("WritoFest/Registrations");

    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                count++;
                participants.push(element.val());

            });

            participants.push({ "Total : ": count });


            res.send(participants);

        }
    });

})

app.get("/registrationDetails19", (req, res) => {

    count = 0;
    participants = [];
    var ref = firebase.database().ref("WritoFest/Registrations/WritoFest2020/ViaWebsite");

    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                count++;
                participants.push(element.val());

            });

            participants.push({ "Total : ": count });


            res.send(participants);

        }
    });

})

app.get("/getAndroidWeb", (req, res) => {
    let array;
    participants = new Set();
    var ref = firebase.database().ref("Recruitments/Registrations/ViaWebsite");

    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                //   console.log(element.val());
                if (element.val().year === "2") {
                    element.val().IntersetedIn.forEach(ele => {
                        console.log(ele);
                        if (ele === "androidDevelopment" || ele === "webDevelopment") {
                            participants.add(element.val().Email);
                        }
                    })

                }

            });

            participants.add({ "Total : ": count });
            array = [...participants];


            res.send(array);

        }
    });

})




app.get("/getRageParticipantsEmail", (req, res) => {
    var ref = firebase.database().ref("/Workshop/Registrations/ViaWebsite/All");
    var arr = [];
    ref.once('value').then(snap => {
        snap.forEach(element => {
            arr.push(element.val().Email);
        });
        res.send(arr);
    })

})


const checkRecruitmentsRegistrationStart = (callback) => {
    var ref = firebase.database().ref("/Recruitments");
    ref.once('value').then(snap => {
        callback(snap.val().registrationstart);
    })
}


const checkRegistrationStart = (callback) => {
    var ref = firebase.database().ref("/WritoFest");
    ref.once('value').then(snap => {
        callback(snap.val().registrationstart);
    })
}

const checkWorkshopRegistrationStart = (callback) => {
    var ref = firebase.database().ref("/Workshop");
    ref.once('value').then(snap => {
        // console.log(snap.val());
        callback(snap.val().registrationstart);
    })
}


const checkParticipants = (email, usn, url, callback) => {
    var message = "";
    var ref = firebase.database().ref(url);

    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                if (email === element.val().Email || usn === element.val().USN) {
                    message = "already exists";
                }
            });
            return callback(message);
        } else {
            return callback(message);
        }
    })
}


const checkParticipantWorkshop = (email, usn, url, callback) => {
    var message = "";
    var key = "";
    var ref = firebase.database().ref(url);
    ref.once('value').then(snap => {
        if (snap.val() != null) {
            snap.forEach(element => {
                // console.log(selected,element.val().OptedFor);
                if ((email === element.val().Email || usn === element.val().USN)) {
                    message = "already exists";
                }
            });
            return callback(message, key);
        } else {
            return callback(message, null);
        }
    })
}



app.get("/team", (req, res) => {
    res.render("members", { csrfToken: req.csrfToken() });
})

app.get("/event/WritoFest2k23", (req, res) => {
    return res.render("register-2k23", { csrfToken: req.csrfToken() });
})

app.get("/event/WritoFest2k22", (req, res) => {
    res.render("writoFest2k22", { csrfToken: req.csrfToken() });
})

app.get("/event/WritoFest", (req, res) => {
    res.render("event", { csrfToken: req.csrfToken() });
})

app.get("/event/RAGE", (req, res) => {
    res.render("workshop", { csrfToken: req.csrfToken() });
})

app.get("/registerWorkshop", (req, res) => {
    res.render("registerWorkshop", { csrfToken: req.csrfToken() });
})

app.get("/register", (req, res) => {
    res.render("register", { csrfToken: req.csrfToken() });
})

app.get("/recruitments", (req, res) => {
    res.render("recruit", { csrfToken: req.csrfToken() });
})



const checkCouponCode = (code, callback) => {
    var ref = firebase.database().ref("/WritoFest/Registrations/WritoFest2022/coupon");
    ref.once('value').then(snap => {
        if (code === snap.val()) {
            return callback("valid");
        } else {
            return callback("invalid");
        }
    })

}

app.post('/sendMail', (req, res) => {
    var name = req.body.name;
    var usn = req.body.usn.toLowerCase();
    var email = req.body.email.toLowerCase();
    var razo = req.body.razo;
    console.log(name, usn, email, razo);
    sendMail("writoFest", email, name, usn, razo, "", "", "")
        .then((result) => {
            console.log(result);
            res.send({ message: "success" });

        })
        .catch((error) => {
            console.log(error.message)
            res.send({ message: "error" });
        });
})


// app.post('/createOrder', (req, res) => {
//     var email = req.body.email;
//     var usn = req.body.usn;
//     var code = req.body.code;
//     var college = req.body.college;
//     checkRegistrationStart(start => {
//         if (start === 1) {
//             checkParticipants(email, usn, "/WritoFest/Registrations/WritoFest2022/ViaWebsite", (info) => {
//                 if (info === "already exists") {
//                     res.send({ message: "already exists" });
//                 } else {
//                     var amount = 5000;
//                     if (code.trim() === "" && college === "Others") {
//                         razorpay.orders.create({
//                             amount: amount,
//                             currency: "INR",
//                         }, (err, order) => {
//                             if (!err)
//                                 res.status(200).send({ message: order });
//                             else
//                                 res.status(409).send({ error: err });
//                         });
//                     } else if (code.length > 0 && college === "Others") {
//                         checkCouponCode(code, (status) => {
//                             if (status === "valid") {
//                                 amount = 5000;
//                                 razorpay.orders.create({
//                                     amount: amount,
//                                     currency: "INR",
//                                 }, (err, order) => {
//                                     if (!err)
//                                         res.status(200).send({ message: order });
//                                     else
//                                         res.status(409).send({ error: err });
//                                 });
//                             } else {
//                                 res.status(200).send({ message: "invalid code" });
//                             }

//                         })
//                     } else if (college === "Siddaganga Institute of Technology") {
//                         amount = 5000;
//                         razorpay.orders.create({
//                             amount: amount,
//                             currency: "INR",
//                         }, (err, order) => {
//                             if (!err)
//                                 res.status(200).send({ message: order });
//                             else
//                                 res.status(409).send({ error: err });
//                         });
//                     }

//                 }
//             })
//         } else {
//             res.status(200).send({ message: "" });
//         }
//     })

// })

// app.post("/checkStart",(req,res)=>{

// })

app.post("/registerForRecruitments", (req, res) => {
    var messageback = "";
    var name = req.body.name;
    var usn = req.body.usn.toLowerCase();
    var email = req.body.email.toLowerCase();
    var phone = req.body.phone;
    var selected = req.body.selected;
    var year = req.body.year;

    // console.log(name,usn,email,phone,selected,year);
    var date = new Date();

    var ref = firebase.database().ref(`/Recruitments/Registrations/${date.getFullYear()}/ViaWebsite`);
    checkRecruitmentsRegistrationStart((start) => {

        if (start === 1) {
            checkParticipants(email, usn, `/Recruitments/Registrations/${date.getFullYear()}/ViaWebsite`, (info, key) => {
                // console.log(info);
                if (info === "already exists") {
                    messageback = info;
                    res.send({ message: messageback });
                } else {
                    ref.child(`+91${phone}`).set({
                        Name: name,
                        Email: email,
                        USN: usn,
                        year: year,
                        "Phone Number": phone,
                        "Time of Registration": date.toString(),
                        "Date of Registration": date.toLocaleDateString(),
                        "IntersetedIn": selected
                    }, (error) => {
                        if (error) {
                            res.send({ message: "error" });
                        } else {
                            messageback = "success";

                            // sendMail("",email,name,androidLink,openRecitalLink,graphicLink)
                            // .then((result) =>{
                            //     console.log(result);
                            //     // return res.send({message:messageback});

                            // })
                            // .catch((error) =>{console.log(error.message)
                            //             //   res.send({message:messageback});
                            // });

                            res.send({ message: messageback });


                        }
                    });





                }
            })
        } else {
            messageback = "not started";
            res.send({ message: messageback });
        }
    })

})




// Here I am doing changes

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  app.post("/registerParticipants", (req, res) => {
    console.log('This is called');
    var name = req.body.name;
    var usn = req.body.usn.toLowerCase();
    var email = req.body.email.toLowerCase();
    var phone = req.body.phone;
    var city = req.body.city;
    var college = req.body.college;

    var ref = firebase.database().ref("/registrations-2k23/" + phone);

    checkRegistrationStart((start) => {
        if (start === 1) {
            var date = new Date();

            ref.set({
                Name: name,
                Email: email,
                USN: usn,
                "Phone Number": phone,
                City: city,
                College: college,
                "Time of Registration": date.toString(),
                "Date of Registration": date.toLocaleDateString(),
            }, (error) => {
                if (error) {
                    res.send({ message: "error" });
                } else {
                    res.send({ message: "success" });
                }
            });
        }
    });
});


app.post('/createOrder', (req, res) => {
    var email = req.body.email;
    var usn = req.body.usn;
    var code = req.body.code;
    var college = req.body.college;
    var referral = req.body.referral;
    console.log(referral);

    checkRegistrationStart(start => {
        if (start === 1) {
            checkParticipants(email, usn, "/registrations-2k23/", (info) => {
                if (info === "already exists") {
                    res.send({ message: "already exists" });
                } else {
                    var baseAmount = 7000;  
                    if (referral.trim() !== "") {
                        if (validReferralCode(referral.trim())) {
                            baseAmount = 5000;  // Adjust amount for referrals (replace with your referral amount)
                        } else {
                            res.status(200).send({ message: "invalid code" });
                            return;
                        }
                    }

                    // Create Razorpay order
                    razorpay.orders.create({
                        amount: baseAmount,
                        currency: "INR",
                    }, (err, order) => {
                        if (!err)
                            res.status(200).send({ message: order });
                        else
                            res.status(409).send({ error: err });
                    });
                }
            })
        } else {
            res.status(200).send({ message: "" });
        }
    })
});

// Replace this function with your actual referral code validation logic
function validReferralCode(code) {
    const validReferralCodes = ['SUNI2K23', 'PADM2K23', 'NISH2K23', 'SANJ2K23', 'SAMG2K23', 'AKSH2K23', 'SAMA2K23', 'ADHA2K23', 'ROJA2K23', 'RAJE2K23', 'NISA2K23', 'BHAR2K23', 'ARFA2K23', 'PUNY2K23', 'SARI2K23', 'SUNP2K23', 'ANUS2K23', 'CHAY2K23', 'KAVA2K23', 'VARU2K23', 'SHRE2K23','KUMK2K23'];

    // Check if the provided code is in the list of valid referral codes
    return validReferralCodes.includes(code);
}


app.post("/checkUserExistence", (req, res) => {
    var email = req.body.email;
    var usn = req.body.usn;
    var phone = req.body.phone;

    var ref = firebase.database().ref("/registrations-2k23/");

    // Check if the user with the given email exists
    ref.orderByChild("Email").equalTo(email).once("value", function (snapshotEmail) {
        if (snapshotEmail.exists()) {
            res.send({ message: "already exists" });
        } else {
            // Check if the user with the given phone number exists
            ref.orderByChild("Phone Number").equalTo(phone).once("value", function (snapshotPhone) {
                if (snapshotPhone.exists()) {
                    res.send({ message: "already exists" });
                } else {
                    // No user with the given email, USN, and phone number exists
                    res.send({ message: "not exists" });
                }
            });
        }
    });
});

// I am done with my changes













// app.post("/registerParticipants", (req, res) => {
//     var messageback = "";
//     var name = req.body.name;
//     var usn = req.body.usn.toLowerCase();
//     var email = req.body.email.toLowerCase();
//     var phone = req.body.phone;
//     var city = req.body.city;
//     var college = req.body.college;
//     //   var selected=req.body.selected;
//     //   var razorpay_payment_id =req.body.razorpay_payment_id;
//     //   var order_id = req.body.order_id;


//     //   razorpay.payments.fetch(razorpay_payment_id).then(doc=>{
//     //       if(doc.status === "captured"){

//     var ref = firebase.database().ref("/WritoFest/Registrations/WritoFest2022/ViaWebsite/" + phone);

//     // var userkey = ref.push().key;

//     checkRegistrationStart((start) => {

//         if (start === 1) {
//             checkParticipants(email, usn, "/WritoFest/Registrations/WritoFest2022/ViaWebsite", (info) => {
//                 console.log(info);
//                 if (info === "already exists") {
//                     messageback = info;
//                     res.send({ message: messageback });
//                 } else {

//                     //                 isValidEmail(email,isValid=>{
//                     //                     isValidPhone(phone,isValidnumber=>{
//                     //                         console.log(isValid,isValidnumber);
//                     //                       if(isValid && isValidnumber){      
//                     var date = new Date();

//                     ref.set({
//                         Name: name,
//                         Email: email,
//                         USN: usn,
//                         "Phone Number": phone,
//                         City: city,
//                         College: college,
//                         "Time of Registration": date.toString(),
//                         "Date of Registration": date.toLocaleDateString(),
//                         // "order_id":order_id,
//                         // "razorpay_payment_id":razorpay_payment_id
//                     }, (error) => {
//                         if (error) {
//                             res.send({ message: "error" });
//                         } else {
//                             messageback = "success";
//                             res.send({ message: messageback });
//                             // sendMail("writoFest",email,name,usn,razorpay_payment_id,"","","")
//                             //       .then((result) =>{
//                             //         //   console.log(result);
//                             //           res.send({message:messageback});

//                             //       })
//                             //       .catch((error) =>{console.log(error.message)
//                             //                     res.send({message:messageback});
//                             //       });


//                         }
//                     });
//                 }

//             })
//         }
//     })
//     //     }else{
//     //         messageback="invalid";
//     //         res.send({message:messageback});
//     //     }
//     // })
//     //     })


//     // }
//     // })
//     // }else{
//     //     messageback="not started";
//     //     res.send({message:messageback});
//     // }
//     // else{
//     //     res.send({message:"error"});
//     // }
//     // })




//     //  if(selected === ""){
//     //      res.send({message:"checkbox not selected"});
//     //  }
//     //  else{







// })


app.get("/boarding", (req, res) => {
    res.render("boarding", { name: "Anurag", usn: "1si19cs014", razorpay_id: "qwerty" })
})

app.post("/registerForWorkshop", (req, res) => {
    var messageback = "";
    var name = req.body.name;
    var usn = req.body.usn.toLowerCase();
    var email = req.body.email.toLowerCase();
    var phone = req.body.phone;
    var city = req.body.city;
    var selected = req.body.selected;
    var year = req.body.year;
    var androidLink = "";
    var openRecitalLink = "";
    var graphicLink = "";
    var recital = false;

    var todate = new Date();
    todate = todate.getFullYear();

    console.log(req.body);

    var date = new Date();

    var ref = firebase.database().ref(`/Workshop/Registrations/${todate}/ViaWebsite`);
    var refCount = firebase.database().ref(`/Workshop/Registrations/${todate}/ViaWebsite/count`);
    var userkey = ref.push().key;


    selected.forEach(element => {
        if (typeof (element) === "object") {
            openRecitalLink = "•Join WhatsApp Group for Open Mic <br>https://chat.whatsapp.com/DWTjK9EcJS5JsVXqkaW9V6<br>";
            element.option.forEach(item => {
                if (item !== "Audience") {
                    recital = true;
                }
            });
        } else {
            if (element === "androidDevelopment") {
                androidLink = "•Join WhatsApp Group for Android Workshop <br>https://chat.whatsapp.com/BOthLS5csTCAZOa38R5XlF<br>";
            } else {
                graphicLink = "•Join WhatsApp Group for After Effects Workshop <br>https://chat.whatsapp.com/Jb5EfWIGCt2GEOBfsIztlm<br>";
            }
        }
    });



    checkWorkshopRegistrationStart((start) => {

        if (start === 1) {
            checkParticipantWorkshop(email, usn, `/Workshop/Registrations/ViaWebsite/All`, (info, key) => {
                // console.log(info);
                if (info === "already exists") {
                    messageback = info;
                    res.send({ message: messageback });
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

                } else {
                    var ref1;
                    if (recital === true) {
                        ref1 = ref.child("Performer").child(`+91${phone}`);
                        ref1.set({
                            Name: name,
                            Email: email,
                            USN: usn,
                            year: year,
                            "Phone Number": phone,
                            City: city,
                            "Time of Registration": date.toString(),
                            "Date of Registration": date.toLocaleDateString(),
                            "OptedFor": selected
                        }, (error) => {
                            if (error) {
                                res.send({ message: "error" });
                            } else {
                                ref.child("All").child(`+91${phone}`).set({
                                    Name: name,
                                    Email: email,
                                    USN: usn,
                                    year: year,
                                    "Phone Number": phone,
                                    City: city,
                                    "Time of Registration": date.toString(),
                                    "Date of Registration": date.toLocaleDateString(),
                                    "OptedFor": selected
                                }, (error) => {
                                    if (error) {
                                        res.send({ message: "error" });
                                    } else {
                                        messageback = "success";

                                        sendMail("", email, name, androidLink, openRecitalLink, graphicLink)
                                            .then((result) => {
                                                console.log(result);
                                                //    return res.send({message:messageback});

                                            })
                                            .catch((error) => {
                                                console.log(error.message)
                                                //   res.send({message:messageback});
                                            });

                                        res.send({ message: messageback });


                                    }
                                });
                            }
                        });
                    } else {
                        ref.child("All").child(`+91${phone}`).set({
                            Name: name,
                            Email: email,
                            USN: usn,
                            year: year,
                            "Phone Number": phone,
                            City: city,
                            "Time of Registration": date.toString(),
                            "Date of Registration": date.toLocaleDateString(),
                            "OptedFor": selected
                        }, (error) => {
                            if (error) {
                                res.send({ message: "error" });
                            } else {
                                messageback = "success";

                                sendMail("", email, name, androidLink, openRecitalLink, graphicLink)
                                    .then((result) => {
                                        console.log(result);
                                        // return res.send({message:messageback});

                                    })
                                    .catch((error) => {
                                        console.log(error.message)
                                        //   res.send({message:messageback});
                                    });

                                res.send({ message: messageback });


                            }
                        });
                    }




                }
            })
        } else {
            messageback = "not started";
            res.send({ message: messageback });
        }
    })





})




app.post("/getTeam", (req, res) => {
    var member = [];
    var ref = firebase.database().ref("/Our Team");
    ref.once("value").then(snap => {
        snap.forEach(element => {
            member.push(element.val());
        })
        res.send({ array: member });
    })
})

app.get("/timeline", (req, res) => {
    res.render('timeline.ejs', { csrfToken: req.csrfToken() })
})


//category route
app.get("/:post", function (req, res) {

    var posts = [];
    var backimg = [];
    var category = req.params.post;
    var categoryName, caption, image, back;

    if (category === "inspiration") {
        categoryName = "Inspiration";
        caption = "Grow Inspired";
        image = "srk.jpg";
        back = "inspiration.jpg";

    }
    else if (category == "love") {
        categoryName = "Love";
        caption = "A Bliss Feeling";
        image = "love.jpg";
        back = "loveback.jpg";
    }
    else if (category == "sad") {
        categoryName = "Sad";
        caption = "Life shows it's way";
        image = "sad1.jfif";
        back = "sadb.jpg";
    } else if (category == "science") {
        categoryName = "Science";
        caption = "Innovate with Science";
        image = "space.jpg";
        back = "spaceb.jpg";
    } else {
        res.send("Error 404");
    }

    res.render(__dirname + "/views/posts.ejs", { category: categoryName, caption: caption, image: image, back: back, csrfToken: req.csrfToken() });



})

app.post("/getData", function (req, res) {
    var type = req.body.type;
    var array = [];
    var backimg = [];
    var category = req.body.category;
    if (category === "Science") {
        category = "science fiction"
    }
    var ref = firebase.database().ref("/categories/" + category.toLowerCase() + "/" + type + "/writings/english");
    var ref1 = firebase.database().ref("/categories/" + category.toLowerCase() + "/" + type + "/backimgurls/english");
    ref.once('value').then(snap => {
        snap.forEach(element => {
            array.push(element.val());
        });
        ref1.once('value').then(snap1 => {
            snap1.forEach(element => {
                backimg.push(element.val());
            });
            res.send({ array: array, backimg: backimg });
        });
    })
});


app.listen(process.env.PORT || 3000, function () {
    console.log("ScriptInk Website Is live on server 3000");
});
