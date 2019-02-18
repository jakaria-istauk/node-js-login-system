const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

var connection = require('./config');

var app = express();

app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/login.html', function(request, response) {
  response.sendFile(path.join(__dirname+'/login.html'));
});

app.post('/auth', function(request, response){
  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    connection.query('SELECT * FROM  admin WHERE username = ? AND password = ?',[username, password], function(error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/home');
      }else {
        response.send('Incorrect mail or password');
      }
      response.end();
    });
  }else {
    response.send('PLease enter Username and Password');
    response.end();
  }
});

app.get('/home', function (request, response) {
  if (request.session.loggedin) {
    response.send('Welcome back '+request.session.username+'!');
  }else {
    response.send('Please login to view this page!');
  }
  response.end();
});

app.listen(3000);
