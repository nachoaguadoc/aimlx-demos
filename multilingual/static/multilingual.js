function submit_all_docs(){
    $.ajax({
           url: "/multilingual/alldocs",
           type: "POST",
           processData: false,
           contentType: false,
           success: function(response) {
                window.location.href = "/multilingual/alldocs";
           },
           error: function(jqXHR, textStatus, errorMessage) {
               console.log(errorMessage); // Optional
           }
    });

 }

 function submit_choose_doc(){
     $.ajax({
            url: "/multilingual/choosedoc",
            type: "POST",
            processData: false,
            contentType: false,
            success: function() {
                window.location.href = "/multilingual/choosedoc";
            },
            error: function(jqXHR, textStatus, errorMessage) {
                 errorMessage = "Method failed";
                 console.log(errorMessage); // Optional
            }
     });

  }

var radiobutton;
$('#choose-mode').click(function(e){
    //$('#demoMode input').on('click', function() {
        var radiobutton = $('input[name=dummy]:checked', '#demoMode').attr('id');
        console.log(radiobutton);
    //});
   // alert($('input[name=dummy]:checked', '#demoMode').attr('id'));

   if (radiobutton == "alldocs"){
        console.log("redirect to /alldocs");
        submit_all_docs();
   }
   if (radiobutton == "choosedoc"){
        submit_choose_doc();
   }
});

$(document).ready(function(){



});