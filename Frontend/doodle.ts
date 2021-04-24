/*
   Achtung - wichtige Hinweise: 
   -----------------------------------------------------------------------------
   1) Sollte VSC jQuery nicht kennen, dann müssen die Typen erst importiert werden
      Führen Sie dazu Folgendes im Terminal von VSC aus:
         npm install --save @types/jquery
   2) Fehlermeldung beim Ausführen von Ajax-Requests: 
      "Quellübergreifende (Cross-Origin) Anfrage blockiert: Die Gleiche-Quelle-Regel verbietet das Lesen der externen Ressource ..."
      --> das passiert wenn Client und Server von unterschiedlichen Quellen kommen
          (z.B. Client: http://localhost:3000/...
                Server: http://localhost:80/... )
      --> dann muss für den Server angegeben werden, dass er das Ergebnis ausliefern darf
      --> Erstellen einer .htaccess - Datei im Verzeichnis der anzusprechenden PHP-Datei mit folgendem Inhalt:
             Header set Access-Control-Allow-Origin "*"
*/

// Settings:
let restServer: string = "http://localhost:80/SS2021/Pr/Backend/serviceHandler.php";
let jsondata = new Array;
//------------------------------GET APPOINTMENTS AND DISPLAY THEM----------------------------------
$.getJSON(restServer,
   { 'method': 'getAppointment' },
   function (data: any) {
      data.forEach(function (item: any) {
         let expire = "";
         let hide = "";
         let date = new Date(item.Ablaufdatum);
         let now = new Date;
         if (+date <= +now) {
            expire = "style='color: red'";
            hide = "style='display: none'";
         }
         $('#eventlist').append("<li " + expire + ">" + "Title: " + item.Titel + " Place: " + item.Ort + " Till: " + item.Ablaufdatum + "<button " + hide + " id='detail' data-id=" + item.ID + " onClick='displaytermin(" + item.ID + ")'>Details</button></li><div id=" + item.ID + "><div id='comments" + item.ID + "'></div></div><hr>");
      });
   });


//---------------------------IF CLICKED ON DETAILS LOAD TERMINOPTIONEN,COMMENTS AND SEND PARAMS FOR FORM IF FORM IS SUBMITTED-----------------

function displaytermin($id: number) {

   const evt = function (this: any) {
      return this;
   };
   if ($(evt).attr('value') == 'show') {
      $(evt).attr('value', 'hide');
      $('#' + $id).slideDown();
   } else {
      $(evt).attr('value', 'show');
      $('#' + $id).slideUp();
   }
   $.getJSON(restServer,
      { 'method': 'gettermin', 'param': $id },
      function (data: any) {
         let vote = document.createElement("form");
         if ($('#' + 0 + $id).length < 1) {
            vote.id = "form" + $id;
            let user = document.createElement("input");
            user.type = "text";
            user.name = "user";
            user.required = true;
            user.placeholder = "Username";
            let comment = document.createElement("input");
            comment.type = "text";
            comment.name = "comment";
            comment.placeholder = "Comment here...";
            let save = document.createElement("input");
            save.type = "submit";
            save.value = "Save";
            vote.appendChild(comment);
            vote.appendChild(user);
            let count = 0;
            $('#' + $id).append(vote);
            data.forEach(function (item: any) {
               let req = "";
               if (count <= 0) {
                  req = "required";
               }
               $("#form" + $id).append("<li id=" + 0 + $id + "> Date: " + item.Datum + "<br>Total Votings: " + item.Votings + "<input type='checkbox' name='vote[" + item.ID + "]' id=" + count + " " + req + "></li>");
               count++;
            })
            vote.appendChild(save);
         };
      });

   $('form#form' + $id).on("submit", function (event) {
      var data = $("form#form" + $id).serialize();
      $.ajax({
         url: restServer,
         method: "POST",
         dataType: 'json',
         data: data,
         success: function (data) {
            alert($('form#form' + $id).serialize());
         },
         error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.statusText);
            alert(xhr.responseText);
         }
      });
      event.preventDefault();
   })
   $.getJSON(restServer,
      { 'method': 'getComments', 'param': $id },//get comments for this appointment
      function (data: any) {
         if ($('#cmt' + $id).length < 1) {
            data.forEach(function (item: any) {
               $('#comments' + $id).append("<li id='cmt" + $id + "'><small>" + item.Username + "</small>: " + item.Comment + "</li>");
            })
         }
      });
}

//--------------------CREATE FORM-----------------------
function createinput(property: any, datatype: any) {
   const label = document.createElement("label");
   label.textContent = property;
   label.htmlFor = property;
   form.appendChild(label);

   const input = document.createElement("input");
   input.id = property;
   input.name = property;
   if (datatype === String) {
      input.type = "text";
      input.required = true;
      //input.addEventListener("input", oninput);
   }
   else if (datatype === Date) {
      input.type = "date";
      //input.addEventListener("input", oninput);
   }
   form.appendChild(input);
   const br = document.createElement("br");
   form.appendChild(br);
}

function pop() {
   $("#newappointmentform").show();
}

function hide() {
   $("#newappointmentform").hide();
}

const form = document.createElement("form");//create form
createinput("Place", String);
createinput("Date", Date);
createinput("Name", String);
createinput("Till", Date);
const button = document.createElement("input");
button.id = "submit";
button.type = "submit";
button.innerHTML = "Submit";
const add = document.createElement("button");
add.type = "button";
add.id = "addBtn";
add.innerHTML = "add";
form.appendChild(add);
form.appendChild(button);
form.id = "newappointmentform";
form.method = "POST";
document.getElementById("createapp")?.appendChild(form);
$("#newappointmentform").hide();

const popup = document.createElement("button");
popup.innerHTML = "new";
popup.addEventListener("click", pop);
document.body.appendChild(popup);

const closebutton = document.createElement("button");
closebutton.innerHTML = "close";
closebutton.addEventListener("click", hide);
document.body.appendChild(closebutton);
//---------------------------NEW APPOINTMENT REQUEST------------------------------
$(() => {
   $('form#newappointmentform').on("submit", function (event) {
      var data = $("form#newappointmentform").serialize();
      $.ajax({
         url: restServer,
         method: "POST",
         dataType: 'json',
         data: data,
         success: function (data) {
            alert($('form#newappointmentform').serialize());
         },
         error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.statusText);
            alert(xhr.responseText);
         }
      });
      event.preventDefault();
   })
   var counter = 1;
   $("#addBtn")//-----------ADD TERMINOPTIONEN-------------
      .click(
         function () {
            const option = document.createElement("input");
            option.type = "date";
            option.id = "option" + counter;
            option.name = "option[" + counter+"]";
            form.insertBefore(option, button);
            counter++;
         });
});

