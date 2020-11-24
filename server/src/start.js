require('dotenv').config();
const fs = require('fs');
const https = require('https');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routesApi = require('../src/api/routes/index.js')
require('../src/api/config/passport');
const performMaintenance = require('../src/api/models/maintenance.js');
const notify = require('../src/api/models/sendHomeworkNotifications.js');

var port = '8080';
var app = express();
app.set('port', port);
app.use(bodyParser.json()); // convert requests into json
app.use(bodyParser.urlencoded({ extended: false}));

const allowedExt = [
  '.js',
  '.ico',
  '.css',
   '.png',
   '.jpg',
   '.jpeg',
   '.gif'
];

//All API Endpoints
app.use('/api', routesApi);

//Support AWS Health Check
app.get('/ping', (req, res) => {
    res.status(200).end();
});

//Dead code, load balancer handles this
if(process.env.NODE_ENV == 'production') {
  app.use(function(req, res, next) {
    console.log(req.hostname, req.ip, req.ips, req.protocol, req.secure);
    if(req.protocol === 'http') {
      res.redirect('301', `https://${req.headers.host} ${req.url}`);
    }
    next();
  });
}

//All Front end resources
app.get('*', (req, res) => {
  if(allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`../client/dist/${req.url}`));
  } else {
    res.sendFile(path.resolve('../client/dist/index.html'));
  }
});

if(process.env.NODE_ENV == 'production') {
  console.log("RUNNING IN PRODUCTION MODE");

  const httpsOptions = {
      cert: fs.readFileSync('/home/ec2-user/ssl/youforgotsecurity/certificate.pem'),
      ca: fs.readFileSync('/home/ec2-user/ssl/youforgotsecurity/chain.pem'),
      key: fs.readFileSync('/home/ec2-user/ssl/youforgotsecurity/private.key')
  };
  var server = https.createServer(httpsOptions, app);
  server.listen('443', '172.31.15.26');
  server.on('error', onError);
  server.on('listening', onListening);
} else {
  var http = require('http');
  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('HTTPS listening on ' + bind);
}

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

//Christian Devile's Simple API Request Assignment 3
// app.get('/test1', (req, res) => {
//   res.send("Hello world");
// });
//Kenny Lee's Simple API Request for Assignment 3
// app.get('/yeet', (req, res) => {
//   res.send("yeet");
// });
//Ryan Dimitri Ramos's Simple API Request for Assignment 3
// app.get('/dimitri', (req, res) => {
//   res.send("Hi, this is Dimitri's test");
// });
//Nicholas Stewart's Simple API Request for Assignment 3
// app.get('/nicholas', (req, res) => {
//   res.send("I like Moose.");
// });

// check every hour to clean the DB 
setInterval(performMaintenance.clean, 3600000);

//check every hour to send notifications
setInterval(notify.sendNotification, 3600000);
