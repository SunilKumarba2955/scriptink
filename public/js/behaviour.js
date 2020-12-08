$(document).ready(function(){


    var navbarChange = function () {
        if ($(".navbar").offset().top > 100) {
            $(".navbar").addClass("navbar-transparent");
        
        } else {
            $(".navbar").removeClass("navbar-transparent");
    
        }
    };
    $(window).scroll(navbarChange); 


var mybutton =document.getElementById('myBtn');

var date =new Date;
var year=date.getFullYear();

$(".footer p").html('Copyright © ScriptInk '+year);

window.onscroll=function(){
    scrollfunction()
};
function scrollfunction(){
    if(document.body.scrollTop>20||document.documentElement.scrollTop>20){
        mybutton.style.display="block";
    }else{
        mybutton.style.display="none"; 
    }
}

function topFunction(){
    document.body.scrollTop=0;
    document.documentElement.scrollTop=0;
}

$("#myBtn").on('click',topFunction);

});
$('.close').on('click',function(){
    $('.message').css({"display":"none"});
  })

  $("#register").on("submit",(e)=>{
    e.preventDefault();
    var name=$('#name').val();
    var usn=$('#usn').val();
    var email=$('#email').val();
    var phone=$('#phone').val();
    var city=$('#city').val();
    var college=$('#college').val();
   
   
   
       $.ajax({
         url:"/registerParticipants",
         method:"post",
         data:{name:name,email:email,usn:usn,city:city,phone:phone,college:college},
         success:function(result,status,xhr){
            //    console.log(result.message);
                if(result.message==='empty'){
                  $(".message").css({"display":"block"})
                  $(".message").css({'background-color':"red"});
                  $(".message-info").html(
                     "Fill all the Fields"
                  )
                }
                else if(result.message==='success'){
                 $(".message").css({"display":"block"})
                 $(".message").css({'background-color':"green"});
                 $(".message-info").html(
                   "<p style="+"margin:0;"+">Successfully Submitted </p> Please Download our App from the Play store  <a class="+"message-anchor"+" href="+"https://play.google.com/store/apps/details?id=com.scriptink.official&hl=en"+"><i class="+"fab fa-google-play"+"></i>Get the App</a>"
                   
                 )
                    
                $('#name').val("");
                $('#email').val("");
                $('#usn').val("");
                $('#phone').val("");
                $('#city').val("");
                $('#college').val("");
                }
                else if(result.message==="not started"){
                    $(".message").css({"display":"block"})
                    $(".message").css({'background-color':"red"});
                    $(".message-info").html(
                       "Registration has not been started yet!"
                    )
                 }else if(result.message==="error"){
                    $(".message").css({"display":"block"})
                    $(".message").css({'background-color':"red"});
                    $(".message-info").html(
                       "Something went wrong!!!"
                    )
                 }else{
                    $(".message").css({"display":"block"})
                    $(".message").css({'background-color':"red"});
                    $(".message-info").html(
                       "You have already registered !!!"
                    )
                 }
   
         },
         error:function(status,xhr,error){
               console.log(error);
         }
   
       })
  })
