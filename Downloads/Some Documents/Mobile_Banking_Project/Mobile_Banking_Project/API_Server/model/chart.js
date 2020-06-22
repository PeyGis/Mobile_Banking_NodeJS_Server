/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */
 //include db
var db = require("../dbconnection");

var Chart = {
	expenseSummary: function(act_id, from_date, end_date, callback){
		if(from_date !== "" && end_date !== ""){
			return db.query("SELECT sum(amount) as total, transaction FROM transaction WHERE channel_number = ? AND date BETWEEN ? AND ? GROUP BY transaction", [act_id, from_date, end_date], callback);
		} else if(from_date !== "" && end_date == ""){
			return db.query("SELECT sum(amount) as total, transaction FROM transaction WHERE channel_number = ? AND date BETWEEN ? AND NOW() GROUP BY transaction", [act_id, from_date], callback);
		} else{
			return db.query("SELECT sum(amount) as total, transaction FROM transaction WHERE channel_number = ? GROUP BY transaction", [act_id], callback);
		}

	},
	expense: function(callback){
		return db.query("select * from person", callback);  
	}

}
module.exports = Chart; 