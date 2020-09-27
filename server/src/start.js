var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var connection = mysql.createConnection({
  host  : 'localhost',
  user  : 'me',
  password : 'yeet',
  database : 'yuh'
});
connection.connect();
connection.end();


//Christian Devile's Simple API Request Assignment 3
app.get('/test1', (req, res) => {
  res.send("Hello world");
});
//Kenny Lee's Simple API Request for Assignment 3
app.get('/yeet', (req, res) => {
  res.send("yeet");
});
//Ryan Dimitri Ramos's Simple API Request for Assignment 3
app.get('/dimitri', (req, res) => {
  res.send("Hi, this is Dimitri's test");
});
//Nicholas Stewart's Simple API Request for Assignment 3
app.get('/nicholas', (req, res) => {
  res.send("I like Moose.");
});

var http = require('http');

var port = '8000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
