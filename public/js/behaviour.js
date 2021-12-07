$(document).ready(function () {
  var navbarChange = function () {
    if ($(".navbar").offset().top > 100) {
      $(".navbar").addClass("navbar-transparent");
      $(".dropdown-menu").addClass("navbar-transparent");
    } else {
      $(".navbar").removeClass("navbar-transparent");
      $(".dropdown-menu").removeClass("navbar-transparent");
    }
  };
  $(window).scroll(navbarChange);

  var mybutton = document.getElementById("myBtn");

  var date = new Date();
  var year = date.getFullYear();
  var day = date.getDate();
  var month = date.getMonth();

  $(".footer p").html("Copyright © ScriptInk " + year);
  $("#date").html(day + "/" + month + "/" + year);

  window.onscroll = function () {
    scrollfunction();
  };
  function scrollfunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  $("#myBtn").on("click", topFunction);
});

$(".close").on("click", function () {
  $(".message").css({ display: "none" });
});

$("#register").on("submit", (e) => {
  // console.log("clicke");
  $(".message").css({ display: "none" });
  $(".loading").show();
  e.preventDefault();

  var token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  var name = $("#name").val();
  var usn = $("#usn").val();
  var email = $("#email").val();
  var phone = $("#phone").val();
  var city = $("#city").val();
  var college = $("#college").val();
  var code = $('#code').val();
  // var selected="";
  // if($('#writing').prop("checked") == true && $('#micOfMotivation').prop("checked") == false){
  //      selected=$('#writing').val();
  // }else if($('#micOfMotivation').prop("checked") == true && $('#writing').prop("checked") == false){
  //     selected=$('#micOfMotivation').val();
  // }else if($('#micOfMotivation').prop("checked") == true && $('#writing').prop("checked") == true){
  //     selected=[$('#writing').val(),$('#micOfMotivation').val()];
  // };

  // if(selected===""){
  //   $(".message").css({"display":"block"})
  //                 $(".message").css({'background-color':"red"});
  //                 $(".message-info").html(
  //                    "Please select the checkbox !!!"
  //                 )
  //                 $('.loading').hide();
  //                 $(".btn-event").prop('disabled', false);
  //                 return;
  // }

  $.ajax({
    url: "/createOrder",
    method: "post",
    headers: {
      "CSRF-Token": token,
    },
    data: { email, usn ,code},
    success: function (result, status, xhr) {
      // console.log(result.message);
      if (result.message === "") {
        $(".message").css({ display: "block" });
        $(".message").css({ "background-color": "red" });
        $(".message-info").html("Registration has not been started yet.");
        $(".btn-event").prop("disabled", false);
        $(".loading").hide();
      } else if (result.message === "already exists") {
        $(".message").css({ display: "block" });
        $(".message").css({ "background-color": "red" });
        $(".message-info").html("You have already registered !!!");
        $(".btn-event").prop("disabled", false);
        $(".loading").hide();
        return;
      }else if(result.message === "invalid code"){
        $(".message").css({ display: "block" });
        $(".message").css({ "background-color": "red" });
        $(".message-info").html("Invalid Cuopon code !");
        $(".btn-event").prop("disabled", false);
        $(".loading").hide();
      }
       else {
        var options = {
          key: "rzp_test_IcUQvZAMSvC5cP",
          name: "WritoFest 2k21",
          description: "Scriptink",
          image:
            "https://firebasestorage.googleapis.com/v0/b/android-app-5c25d.appspot.com/o/Captureaaaa.png?alt=media&token=a60216b2-e740-41e1-aa90-fcfaa9362ed3",
          order_id: result.message.id,
          handler: function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
            $(".btn-event").prop("disabled", true);
            $(".loading").show();
            $('.warning').show();
            $.ajax({
              url: "/registerParticipants",
              method: "post",
              headers: {
                "CSRF-Token": token,
              },
              data: {
                name: name,
                email: email,
                usn: usn,
                city: city,
                phone: phone,
                college: college,
                razorpay_payment_id: response.razorpay_payment_id,
                order_id: result.message.id,
              },
              success: function (result1, status, xhr) {
                // console.log(result1);
                if (result1.message === "success") {
                  $(".message").css({ display: "block" });
                  $(".message").css({ "background-color": "green" });
                  $(".message-info").html(
                    "<p style=" +
                      "margin:0;" +
                      ">Registered Successfully </p> Please Download our App from the Play store  <a class=" +
                      "message-anchor" +
                      " href=" +
                      "https://play.google.com/store/apps/details?id=com.scriptink.official&hl=en" +
                      "><i class=" +
                      "fab fa-google-play" +
                      "></i>Get the App</a>"
                  );
                  $("#name").val("");
                  $("#email").val("");
                  $("#usn").val("");
                  $("#phone").val("");
                  $("#city").val("");
                  $("#college").val("");
                  $("#code").val("");
                  $("#writing").prop("checked", false);
                  $(".btn-event").prop("disabled", false);
                  $("#micOfMotivation").prop("checked", false);
                  $(".loading").hide();
                  $(".warning").hide();
                }
              },
              error: function (status, xhr, error) {
                console.log(error);
              },
            });
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#0f326b",
          },
        };
        var rzp1 = new Razorpay(options);
        $(".loading").hide();
        rzp1.open();
        
      }
    },
    error: function (status, xhr, error) {
      $(".warning").hide();
      $(".loading").hide();
      $(".btn-event").prop("disabled", false);
      // console.log(error);
    },
  });

  //  $.ajax({
  //    url:"/registerParticipants",
  //    method:"post",
  //    headers:{
  //       'CSRF-Token': token
  //    },
  //    data:{name:name,email:email,usn:usn,city:city,phone:phone,college:college,selected:selected},
  //    success:function(result,status,xhr){
  //          console.log(result.message);
  //       $(".btn-event").prop('disabled', false);
  //           if(result.message==='empty'){
  //             $(".message").css({"display":"block"})
  //             $(".message").css({'background-color':"red"});
  //             $(".message-info").html(
  //                "Fill all the Fields"
  //             )
  //             $('.loading').hide();
  //           }
  //           else if(result.message==='success'){
  //            $(".message").css({"display":"block"})
  //            $(".message").css({'background-color':"green"});
  //            $(".message-info").html(
  //              "<p style="+"margin:0;"+">Successfully Submitted </p> Please Download our App from the Play store  <a class="+"message-anchor"+" href="+"https://play.google.com/store/apps/details?id=com.scriptink.official&hl=en"+"><i class="+"fab fa-google-play"+"></i>Get the App</a>"

  //            )

  //           $('#name').val("");
  //           $('#email').val("");
  //           $('#usn').val("");
  //           $('#phone').val("");
  //           $('#city').val("");
  //           $('#college').val("");
  //           $('#writing').prop("checked",false);
  //           $('#micOfMotivation').prop("checked",false);
  //           $('.loading').hide();
  //           }
  //           else if(result.message==="not started"){
  //               $(".message").css({"display":"block"})
  //               $(".message").css({'background-color':"red"});
  //               $(".message-info").html(
  //                  "Registration has not been started yet!"
  //               )
  //               $('.loading').hide();
  //            }else if(result.message==="error"){
  //               $(".message").css({"display":"block"})
  //               $(".message").css({'background-color':"red"});
  //               $(".message-info").html(
  //                  "Something went wrong! Please try Again"
  //               )
  //               $('.loading').hide();
  //            }else if(result.message === "checkbox not selected") {
  //               $(".message").css({"display":"block"})
  //               $(".message").css({'background-color':"red"});
  //               $(".message-info").html(
  //                  "Please select the checkbox !!!"
  //               )
  //               $('.loading').hide();
  //            }
  //            else if(result.message === "invalid"){
  //               $(".message").css({"display":"block"})
  //               $(".message").css({'background-color':"red"});
  //               $(".message-info").html(
  //                  "Please enter a valid email/phone."
  //               )
  //               $('.loading').hide();
  //            }
  //            else {
  //               $(".message").css({"display":"block"})
  //               $(".message").css({'background-color':"red"});
  //               $(".message-info").html(
  //                  "You have already registered !!!"
  //               )
  //               $('.loading').hide();
  //            }

  //    },
  //    error:function(status,xhr,error){
  //       $('.loading').hide();
  //       $(".btn-event").prop('disabled', false);
  //          console.log(error);
  //    }

  //  })
});
