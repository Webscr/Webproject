const bodyParser = require('body-parser');
const {
  Console
} = require('console');
const {
  response
} = require('express');
const express = require('express');
var cors=require('cors');
const app = express();


app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


var data = [{
  "email": "test@test.at",
  "password":"12345678",
  "address": "Noway 13",
  "city": "Hollerbrunn",
  "state": "Austria",
  "postalcode": "1342",
  "score":"0"
},{
  "email": "test@test2.at",
  "password":"12345678",
  "score":"77"
},{
  "email": "test@test3.at",
  "password":"12345678",
  "score":"45"
},
]


var sessionArray=[];

app.use(cors());

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Acess-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, PATCH");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
  next();
});
app.use(express.static('routes'));

app.post('/login', (request, response, next) => {
  const {
    email,
    password,
  } = request.body;
  console.log(request.headers.authorization, request.body)
  const resmail = data.find(user => user.email == email);
  const respass= data.find(pass => pass.password == password);
  if (resmail != undefined&&respass!=undefined) {
    token=Math.random().toString(16).substr(2,8);
    sessionArray.push(token)
    //return response.redirect('/home')
   response.status(200).json({
      token: sessionArray[0],
      email:email,
  });
  }else{
    response.status(401).end("Login failed")
  }

});

app.post('/highscore', (request, response, next) => {
  const{
    email,
    score
  }=request.body;
  var result = data.find(user => user.email == email);
  if(result!=undefined){
    if(score>result.score){
    result.score=score;
    }
    response.status(200).json({
      message: "working"
    })
  }
});


app.post('/logout', (request, response, next) => {
  sessionArray.pop();
  console.log(sessionArray);
  response.status(200).json({
    message: "logout"
  })
});

app.get('/highscore',(request, response, next) => {
  var points=[]
  var sortdata = data.slice(0);
sortdata.sort(function(a,b) {
    return b.score - a.score;
});
  for(x in sortdata){
    points.push({
      username: sortdata[x].email,
      score: sortdata[x].score
    } 
    )}
  response.status(200).json({
    scores: points
  })
});

app.post('/profile',(request, response, next) => {
  let {
    email,
    address,
    city,
    postalcode,
    state,
    username
  } = request.body;
console.log(request.body);
  for(i in data) {
    if(data[i].email == username) {
      email = data[i].email,
      address = data[i].address,
      city = data[i].city,
      postalcode = data[i].postalcode,
      state = data[i].state
    }
  }
  response.status(200).json({
    email: email,
    address:address,
    city:city,
    postalcode:postalcode,
    state:state
  })
});


app.post('/signup', (request, response, next) => {
  const {
    email,
    password,
    address,
    city,
    postalcode,
    state,
  } = request.body;
  var result = data.find(user => user.email == email);
  if (result != undefined) {
    response.status(401).end('user already taken');
  } else {
    data.push({"email":email,"password":password,address:address,
    city:city,
    postalcode:postalcode,
    state:state});
    token=Math.random().toString(16).substr(2,8);
    sessionArray.push(token)
    response.status(201).json({
      email: email,
      token: token
    });
  }
  console.log(data);
});


module.exports = app;
