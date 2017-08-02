var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));

// app.get('/plot/:fileId', function(req, res){
app.get('/plot/:fileId', function(req, res){
    var fileId = req.params.fileId;
    console.log("in /plot function - " + fileId);
    res.redirect('/#/fileUploadDemo/' + fileId + '/plot');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

require("./backend/app.js")(app);

app.listen(port, ipaddress);
// local link ::: http://localhost:3000/
