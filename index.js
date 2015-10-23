var http = require('http');
var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
//var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

var client = require('redis').createClient(process.env.REDIS_URL);

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/set', function(req, res) {
  console.log(req.body);
  client.set(req.body.key, req.body.value, function(err, val) {
    console.log(val);
    res.send(val);
  })
});

app.get('/keys', function(req, res) {
  client.keys('*', function(err, val) {
    console.log(val);
    res.send(val);
  })
});


app.get('/get/:key', function(req, res) {
  if (req.params.key === 'isales-assessment') {
    res.send({
      remoteInjectEnabled: true,
      remoteInjectScriptURL: 'http://192.168.1.2/js/live.js'
    });
  } else {
    client.get(req.params.key, function(err, val) {
      if (err || val === null) { return res.status(404); }
      res.send(val);
    })
  }

});

app.get('/localip', function(req, res) {
  res.json('192.168.1.2');
});

//app.get('/', routes.index);
//app.get('/users', user.list);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
