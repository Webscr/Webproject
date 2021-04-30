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
let restServer: string = "http://localhost:80/WS2020/ueX/Doodle/Backend/serviceHandler.php";
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
            expire = "style='opacity: 0.5'";
            hide = "style='display: none'";
         }
         $('#eventlist').append("<li " + expire + ">" + "Title: " + item.Titel + " Place: " + item.Ort + " Till: " + item.Ablaufdatum + "<button " + hide + " id='detail' data-id=" + item.ID + " onClick='displaytermin(" + item.ID + ")' class='border-step2'>Details</button> <button id='delete' data-id='"+item.ID+"' class='border-step2' onClick='deletetermin(" + item.ID + ")' >Delete</button></li><div id=" + item.ID + "><div id='comments" + item.ID + "'></div></div><hr>");
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
            user.id=""+$id;
            user.required = true;
            user.placeholder = "Username";
            user.className = "border-step2";
            user.addEventListener("keyup",showresults);
            let comment = document.createElement("input");
            comment.type = "text";
            comment.name = "comment";
            comment.placeholder = "Comment here...";
            comment.className = "border-step2";
            let save = document.createElement("input");
            save.type = "submit";
            save.value = "Save";
            save.className = "border-step2";
            let br = document.createElement("br");
            let comlabel = document.createElement("label");
            comlabel.htmlFor = "comment";
            comlabel.textContent = "Comment:"
            let userlabel = document.createElement("label");
            userlabel.htmlFor = "user";
            userlabel.textContent = "Username:"
            vote.appendChild(comlabel);
            vote.appendChild(comment);
            vote.appendChild(br);
            vote.appendChild(userlabel);
            vote.appendChild(user);
            let count = 0;
            $('#' + $id).append(vote);
            data.forEach(function (item: any) {
               $("#form" + $id).append("<br><li id=" + 0 + $id + "> Date: " + item.Datum + "<br><br>Total Votings: " + item.Votings + "<input type='checkbox' name='vote[" + item.ID + "]' id=" + count + " ></div></li><br>");
               count++;
            })
            vote.appendChild(save);
         };
      });

   $('form#form' + $id).on("submit", function (event) {
      var data = $("form#form" + $id).serialize()+"&id="+$id;
      console.log(data);
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

function showresults(this: any){
   if (this.value.length==0) {
      let text=document.getElementById("usersvote") as HTMLElement;
      text.innerHTML=" ";
      return;
  }
  let xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
      if (this.readyState==4 && this.status==200) {
      let text=document.getElementById("usersvote") as HTMLElement;
      text.innerHTML=JSON.parse(JSON.stringify(this.responseText));
      }
  }
  xmlhttp.open("GET",""+restServer+"?method=getusersvotes&q="+this.value,true);
  xmlhttp.send();
}

function deletetermin($id: number){
      var data ={'method':'deleteAppointment','id':$id}
      $.ajax({
         url: restServer,
         method: "POST",
         dataType: 'json',
         data: data
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
   input.placeholder = property + "...";
   
   if (datatype === String) {
      input.type = "text";
      input.required = true;
   }
   else if (datatype === Date) {
      input.type = "date";
   }
   input.className = "border-step2";
   form.appendChild(input);
   let br = document.createElement("br");
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
button.className = "border-step2";
const add = document.createElement("button");
add.type = "button";
add.id = "addBtn";
add.innerHTML = "add";
add.className = "border-step2";


const closebutton = document.createElement("button");
closebutton.innerHTML = "close";
closebutton.type = "button";
closebutton.className = "border-step2";
closebutton.addEventListener("click", hide);

const br = document.createElement("br");

form.appendChild(closebutton);
form.appendChild(br);
form.appendChild(add);
form.appendChild(br);
form.appendChild(button);
form.appendChild(br);
form.id = "newappointmentform";
form.method = "POST";
document.getElementById("createapp")?.appendChild(form);
$("#newappointmentform").hide();

const popup = document.createElement("button");
popup.innerHTML = "new";
popup.className = "border-step2";
popup.addEventListener("click", pop);
document.getElementById("eventlist")?.appendChild(popup);

var mainpart = document.getElementById("mainpart");
mainpart?.classList.add("border-step2");

//---------------------------NEW APPOINTMENT REQUEST------------------------------
var that=this;
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
            option.className = "border-step2";
            form.insertBefore(option, button);
            counter++;
         });
//delete function with jquery
$("delete").on("click",function(){
      let id=$(that).attr("data-id");
      let data ={'method':'deleteAppointment','id':id}
      $.ajax({
         url: restServer,
         method: "POST",
         dataType: 'json',
         data: data
      });
     
   })         
});
$(document).on("click","#delete",function(){
   let $li=$(this).closest("li");
   let $hr=$(this).closest("hr");
   $li.remove();
   $hr.remove();
 console.log($hr);});

