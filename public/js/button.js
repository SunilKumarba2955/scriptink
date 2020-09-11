$(document).ready(function(){

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
   

var category=$(".card-title").html();


generateList('quotes');



$('#filter-section > button').on('click', function() {
    $('#filter-section > button').removeClass('active-button');
    $(this).addClass('active-button');
    var list_name = $(this).text().toLowerCase();
    if(list_name === 'quotes') {
        generateList(list_name);   
    } else if(list_name === 'stories') {
        generateList(list_name);
    } else if(list_name === 'articles') {
        generateList(list_name);
    } else if(list_name === 'poetry') {
        generateList(list_name);
    }
    
});


function generateList(posts) {
    $('.loading').show();
    $(".headers").css("height","100vh")
    var ref=firebase.database().ref("/categories/"+category.toLowerCase()+"/"+posts+"/writings/english");
    var ref1=firebase.database().ref("/categories/"+category.toLowerCase()+"/"+posts+"/writings/backimgurl");
    var result = "";
    var message ="";
    var array=[];
    var backimg=[];
    $('.message').html(message);
    $('#articles').html(result);
    ref.once('value').then(snap=> {
           snap.forEach(element => {
               array.push(element.val());
           });
           ref1.once('value').then(snap1=>{
            snap1.forEach(element => {
                backimg.push(element.val());
            });
            for (var i = 0; i < array.length; i++) {
                result +=
                  `
                    <li data-aos="zoom-in" style="background-image:url('${backimg[i]}');background-size:cover;background-poosition:center">
                    <div class="center-div">
                      <p class="party-body">${array[i]}</p>
                      </div>
                    </li>
                    `
            }
                if(array.length ===  0){
                    $(".headers").css("height","100vh")
                    $(".headers .container").css("height","100vh")
                    message+=
                    `
        
                    <div class="center-div">
                      <p class="party-body">No Post Available</p>
                      </div>
                    `
                    $('.message').html(message);
                    $('.loading').hide();
                }else{
                    $(".headers").css("height","auto")
                    $(".headers .container").css("height","auto")
                    
                }
                $('#articles').html(result);
                $('.loading').hide();
           });
           
    })
    
}


});
