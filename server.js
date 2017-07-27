var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

require ("./public/app.js")(app);

app.listen(port, ipaddress);
// local link ::: http://localhost:3000/
