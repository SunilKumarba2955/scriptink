$(document).ready(function(){


    // var navbarChange = function () {
    //     if ($(".navbar").offset().top > 100) {
    //         $(".navbar").addClass("navbar-transparent");
        
    //     } else {
    //         $(".navbar").removeClass("navbar-transparent");
    
    //     }
    // };
    // $(window).scroll(navbarChange); 


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
