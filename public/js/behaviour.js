var mybutton =document.getElementById('myBtn');

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

$('[data-aos]').parent().addClass('hideOverflowOnMobile');