/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */
var express = require('express');
var bodyParser = require('body-parser');
var person_router = require('./routes/person_routes');
var account_router = require('./routes/account_routes');
var payment_router = require('./routes/payment_route');
var charts_router = require('./routes/chart_route');
var app = express();

app.use( bodyParser.json());       
app.use(bodyParser.urlencoded({   
	extended: true
}));

app.use(person_router);
app.use(account_router);
app.use(payment_router);
app.use(charts_router);

app.listen(8000, function() {
console.log('Listening on port 8000...')
});
