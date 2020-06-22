/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */
 // payment route
var express = require('express'); 
var Payment = require('../model/payment'); 
var bcrypt = require('bcrypt'); 

var router = express.Router();

router.get('/merchants/:id?', function(req, res){

	if(req.params.id){
		Payment.getMerchantById(req.params.id, function(error, result){
			if(error){
				res.send({error: true, message: error.code});
			}
			var msg = (result[0] != null) ? "Merchant found" : "No Merchant Found";
			res.send({error: false, message: msg, merchant: result});
		});
	} else{
		Payment.getAllMerchants(function(error, result){
			if(error){
				res.send({error: true, message: error.code});
			}
			var msg = (result[0] != null) ? "Merchants found" : "No Merchant Found";
			res.send({error: false, message: msg, merchants: result});
		});
	}

});

//Route to process airtime or data recharge
router.post('/merchants/pay/', function(req, res, next) { 

    //get and validate pin from request
    if(req.body.pin){
        Payment.getPersonById(req.body.person_id, function(error, person){
            if(error){
                res.send({error: true, message: error.code}); 
            } else{
                //validate PIN with pin saved in db (hasdhed version)
                if(person[0] != null){
                    bcrypt.compare(req.body.pin, person[0].pin, function(error, hashedPword){
                    //if error
                    if(error){
                         res.send({
                            error:true, 
                            message: "PIN didn't match"
                        });
                    } else{
                        //if pin matches
                        if(hashedPword == true){
                            //Check Account balance
                            Payment.getAccountDetails(req.body.account_id, function(err, rows) {  
                                if (err) {  
                                    res.send({error: true, message: err});  
                                } else {  
                                    //process recharge when amount is lessthan balance
                                    if(rows[0].account_balance >= req.body.amount){
                                        Payment.payMerchant(req.body, function(err, rows) {  
                                            if (err) {  
                                                res.send({error: true, message: err});  
                                            } else { 
                                                var msg = (rows.affectedRows > 0) ? "Payment successfully processed" : "Payment not successful";
                                                res.send({error: false, message: msg});
                                            }  
                                        });  
                                    }  else{
                                        res.send({error: true, message: "Insufficient Account Balance"});  
                                    }
                                }  
                            }); 
                                                
                        } else{ //if pin doesnt match
                            res.send({ 
                            error:true, 
                            message: "PIN didn't match"
                        });
                        }  
                    }
                    });

                } else{  //when user id doesnt match
                    res.send({error: true, message: "User not found"}); 
                }
            }
        });   
    } else{  //when request doesnt have pin
         res.send({error: true, message: "Cannot process transaction without PIN"});
    } 
}); 

module.exports = router;