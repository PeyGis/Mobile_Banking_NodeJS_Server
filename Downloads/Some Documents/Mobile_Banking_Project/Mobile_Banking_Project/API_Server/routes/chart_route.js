/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */
var express = require('express'); 
var Chart = require('../model/chart'); 

var router = express.Router();

router.post('/chart_generic/', function(req, res){

	if(req.body.account_id){
		Chart.expenseSummary(req.body.account_id, req.body.from_date, req.body.end_date, function(error, rows){
			if(error){
				res.send({error: true, message: error.code});
			}
			console.log(rows);
			var msg = (rows[0] != null) ? "Report Found" : "No Report for Account";
            res.send({error: false, chart_obj: rows, message: msg});

		});

	} else{
		res.send({error: true, message: "Cannot process request. No act_id provided"});
	}
});
module.exports = router;