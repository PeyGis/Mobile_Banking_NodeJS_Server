/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */      
    var express = require('express');  
    var bcrypt = require('bcrypt'); 
    var router = express.Router();  
    var Account = require('../model/account');  

    router.get('/account/:act_id?', function(req, res, next) { 
        //get account id from param  
        if (req.params.act_id) {  
            Account.getAccountDetails(req.params.act_id, function(err, rows) {  
                if (err) {  
                    res.send(err);  
                } else {  
                    res.send(rows[0]);  
                }  
            });  
        } else {  
             res.send({message: "Param missing"});
        }  
    });  
    //Route to get all accounts belonging to a particular user
    router.post('/account/user/', function(req, res, next) { 
        //get account id from param  
        if (req.body.person_id) {  
            Account.getUserAccount(req.body.person_id, function(err, rows) {  
                if (err) {  
                    res.send(err);  
                } else { 

                    var msg = (rows[0] != null) ? "Account(s) Found" : "No Account Found for User";
                    res.send({error: false, my_accounts: rows, message: msg})
                }  
            });  
        } else {  
             res.send({message: "Param missing"});
        }  
    });  

    //###############   TRANSACTION RELATED ROUTE   ##########################
    //Route to get transaction history
    router.get('/tr/:act_id?', function(req, res, next) { 
        //get account id from param  
        if (req.params.act_id) {  
            Account.getTransactionHistory(req.params.act_id, function(err, rows) {  
                if (err) {  
                    res.send({error: true, message: err.code});  
                } else {  
                    if(rows[0] == null){
                        res.send({error: true, message: "No History Found for Account"}); 
                    } else{
                         res.send({error: false, history: rows, message: "Transaction History Found"});
                    }
                    //var msg = (rows[0] != null) ? "Transaction History Found" : "No History Found for Account";
                }  
            });  
        } else {  
             res.send({message: "Param missing"});
        }  
    });   


    //route to process account to wallet transaction
    router.post('/tr/account_wallet/', function(req, res, next) {

        //get and validate pin from request
        if(req.body.pin){
            Account.getPersonById(req.body.person_id, function(error, person){
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
                                Account.getAccountDetails(req.body.account_id, function(err, rows) {  
                                    if (err) {  
                                        res.send({error: true, message: err});  
                                    } else {  
                                        //process recharge when amount is lessthan balance
                                        if(rows[0].account_balance >= req.body.amount){

                                            if(req.body.wallet_id == req.body.account_id){
                                                res.send({error: true, message: "Cannot transfer to self account"});  
                                            }
                                            Account.accountToWallet(req.body.account_id, req.body.amount, req.body.wallet_id, function(err, rows) {  
                                                if (err){  
                                                        res.send({error: true, message: err.code});  
                                                } else{ 
                                                        var msg = (rows.affectedRows > 0) ? "Transaction successfully processed" : "Transaction Not successful";
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

    //route to process wallet to account transaction
    router.post('/tr/wallet_account/', function(req, res, next) { 

        //get and validate pin from request
        if(req.body.pin){
            Account.getPersonById(req.body.person_id, function(error, person){
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
                                Account.getWalletDetails(req.body.wallet_id, function(err, rows) {  
                                    if (err) {  
                                        res.send({error: true, message: err});  
                                    } else {  
                                        //process recharge when amount is lessthan balance
                                        if(rows[0].wallet_balance >= req.body.amount){
                                            if(req.body.wallet_id == req.body.account_id){
                                                res.send({error: true, message: "Cannot transfer to self wallet"});  
                                            }
                                            Account.walletToAccount(req.body.wallet_id, req.body.amount, req.body.account_id, function(err, rows) {  
                                                if (err) {  
                                                        res.send({error: true, message: err});  
                                                } else { 
                                                        var msg = (rows.affectedRows > 0) ? "Transaction successfully processed" : "Transaction Not successful";
                                                        res.send({error: false, message: msg});
                                                } 
                                            }); 
                                        }  else{
                                            res.send({error: true, message: "Insufficient Wallet Balance"});  
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

    router.post('/tr/account_account/', function(req, res, next) { 

            //get and validate pin from request
        if(req.body.pin){
            Account.getPersonById(req.body.person_id, function(error, person){
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
                                Account.getAccountDetails(req.body.self_account_id, function(err, rows) {  
                                    if (err) {  
                                        res.send({error: true, message: err});  
                                    } else {  
                                        //process recharge only when amount is lessthan balance
                                        if(rows[0].account_balance >= req.body.amount){
                                            //if transfer is to same account
                                            if(req.body.self_account_id == req.body.other_account_id){
                                                res.send({error: true, message: "Cannot transfer to self account"});  
                                            } else{

                                                Account.accountToAccount(req.body.self_account_id, req.body.amount, req.body.other_account_id, function(err, rows) {  
                                                    if (err) {  
                                                            res.send({error: true, message: err});  
                                                    } else { 
                                                            var msg = (rows.affectedRows > 0) ? "Transaction successfully processed" : "Transaction Not successful";
                                                            res.send({error: false, message: msg});
                                                    } 
                                                }); 
                                            }
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

    //Route to process airtime or data recharge
    router.post('/tr/recharge/', function(req, res, next) { 

        //get and validate pin from request
        if(req.body.pin){
            Account.getPersonById(req.body.person_id, function(error, person){
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
                                Account.getAccountDetails(req.body.account_id, function(err, rows) {  
                                    if (err) {  
                                        res.send({error: true, message: err});  
                                    } else {  
                                        //process recharge when amount is lessthan balance
                                        if(rows[0].account_balance >= req.body.amount){
                                            Account.rechargeAirtime(req.body, function(err, rows) {  
                                                if (err) {  
                                                    res.send({error: true, message: err});  
                                                } else { 
                                                    var msg = (rows.affectedRows > 0) ? "Airtime successfully processed" : "Airtime Purchase Not successful";
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
  

    router.post('/wallet/add/', function(req, res, next) {  

        Account.addWallet(req.body, function(err, result) {  
            //handle when error 
            if (err) {  
                if(err.code == "ER_DUP_ENTRY"){
                    res.send({error:true, message: "Duplicate Wallet"});  
                } else{
                     res.send({error:true, message: err.code});  
                }
                
            } else {  
            //handle when success
                if(result.affectedRows > 0){
                    res.send({error:false, message: "Wallet added successfully"});  

                }
            }    
        });   
    }); 

        //Route to get all accounts belonging to a particular user
    router.post('/wallet/user/', function(req, res, next) { 
        //get account id from param  
        if (req.body.person_id) {  
            Account.getUserWallet(req.body.person_id, function(err, rows) {  
                if (err) {  
                    res.send(err);  
                } else { 

                    var msg = (rows[0] != null) ? "Wallet(s) Found" : "No Wallet Found for User";
                    res.send({error: false, my_wallets: rows, message: msg})
                }  
            });  
        } else {  
             res.send({message: "Param missing"});
        }  
    }); 
  
    module.exports = router;  
    
