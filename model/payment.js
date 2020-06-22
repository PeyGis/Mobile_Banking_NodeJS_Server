/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */
 	//require db connection
 	var db = require('../dbconnection'); //reference of dbconnection.js  
    var mysql = require('mysql');  
    var connection = mysql.createConnection({  
        host: 'localhost',  
        user: 'root',  
        password: '',  
        database: 'nsano_bank_app'  
    });  

var Payment = {

	getAllMerchants: function(callback){
		return db.query("select * from merchant", callback);
	},
	getMerchantById: function(id, callback){
		return db.query("select * from merchant where merchant_id = ?", id, callback);
	},
	getPersonById: function(id, callback) {  
            return db.query("select * from person where person_id=?", [id], callback);  
    },
    getAccountDetails: function(account_id, callback) {  
            return db.query("select * from account where account_id = ?", [account_id], callback);  
    },
    payMerchant: function(Payment, callback){
	    connection.beginTransaction(function(err) {
	      if (err) { 
	        return callback(err, null); 
	        }
	        //first credit account
	      connection.query("update account set account_balance = account_balance - ? where account_id = ?", [Payment.amount, Payment.account_id], function (error, results, fields) {
	        if (error) {
	          return connection.rollback(function() {
	            //throw error;
	            callback(null, results);
	          });
	        } 
	        if(results.affectedRows <= 0){
	            return connection.rollback(function() {
	              //throw error;
	              callback(null, results);
	            });
	          } else{

	            console.log('credited account!');
	            //add details to transaction table
	            connection.query("insert into transaction (channel, channel_number, amount, transaction, details, debit_credit, status) values (?, ?, ?, ?, ?, ?, ?)", 
	                ["Account", Payment.account_id, Payment.amount, "Bill Payment", "Payment of Bills to " + Payment.merchant, "Credit", "Success"],
	                 function (error, results, fields) { 
	                    if (error) {
	                        return connection.rollback(function() {
	                          //throw error;
	                           callback(null, results);
	                        });
	                    } 
	                 }
	                 );
	            }

	            connection.commit(function(err) {
	            if (err) {
	              return connection.rollback(function() {
	                //throw err;
	                callback(null, results);
	                console.log('not success!');
	              });
	            }
	            console.log('success!');
	            return callback(null, results);
	          });
	      });
	    });
}

};
module.exports = Payment;