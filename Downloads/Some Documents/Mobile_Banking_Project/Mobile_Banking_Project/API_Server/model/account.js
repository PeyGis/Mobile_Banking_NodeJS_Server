  /**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */
    var db = require('../dbconnection'); //reference of dbconnection.js  
    var mysql = require('mysql');  
    var connection = mysql.createConnection({  
        host: 'localhost',  
        user: 'root',  
        password: '',  
        database: 'nsano_bank_app'  
    });  

    var Account = {  
        getAccountBalance: function(account_id, person_id, callback) {  
            return db.query("select account_balance from account where account_id = ?", [account_id], callback);  
        }, 
        getUserAccount: function(person_id, callback) {  
            return db.query("select * from account where person_account = ?", [person_id], callback);  
        },
        getUserWallet: function(person_id, callback) {  
            return db.query("select * from wallet where person_wallet = ?", [person_id], callback);  
        },
        getAccountDetails: function(account_id, callback) {  
            return db.query("select * from account where account_id = ?", [account_id], callback);  
        }, 
        getWalletDetails: function(wallet_id, callback) {  
            return db.query("select * from wallet where wallet_id = ?", [wallet_id], callback);  
        },
        getTransactionHistory: function(account_id, callback) {  
            return db.query("select * from transaction where channel_number = ? order by transaction_id desc", [account_id], callback);  
        },
        getPersonById: function(id, callback) {  
            return db.query("select * from person where person_id=?", [id], callback);  
        },
        addWallet: function(Wallet, callback) {  
            var wallet = {
                wallet_id: Wallet.phone,
                network: Wallet.network,
                wallet_balance: 0.0,
                person_wallet: Wallet.person_id
            };
            return db.query("insert into wallet set ?", wallet, callback);  
        },
        debitAccount: function(wallet_id, amount, account_id, callback){
            connection.beginTransaction(function(err){

                //if could not begin transaction
                if(err){
                    return err; 
                }
                //first part of the transaction
                connection.query("update account set account_balance = account_balance + ? where account_id = ?", [amount, account_id], function(err, result){

                    if(err){
                         return connection.rollback(function () {
                                console.log("couldnt commit debit");
                            });
                    } else {

                    if(result.affectedRows > 0){

                    console.log("debited Account " + result.affectedRows);

                    //proceed with the second part of the transaction
                    connection.query("update wallet set wallet_balance = wallet_balance - ? where wallet_id = ?", [amount, wallet_id], function(error, data){

                        if(error){
                             return connection.rollback(function () {
                                    console.log("couldnt commit credit");
                                });
                        }

                        if(data.affectedRows > 0){
                            console.log("credited Wallet " + data.affectedRows);

                            connection.commit(function(err){

                            if(err){
                                return connection.rollback(function () {
                                    console.log("couldnt commit");
                                });
                            }
                            console.log('Transaction Complete.');
                            connection.end();
                            return callback(null, data);

                        });

                        } else{
                            return connection.rollback(function () {
                                    //throw err;
                                });
                        }
                });

                    }
                }
                    connection.end();
                    return callback(null, result);

            });  //end first part

        });  //end begin transaction
        },
        accountToAccount: function(self_account_id, amount, other_account_id, callback){
            connection.beginTransaction(function(err) {
              if (err) { 
                return callback(err, null); 
                }
                //first credit self account
              connection.query("update account set account_balance = account_balance - ? where account_id = ?", [amount, self_account_id], function (error, results, fields) {
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

                    console.log('credited self account!');
                    //add details to transaction table
                    connection.query("insert into transaction (channel, channel_number, amount, transaction, details, debit_credit, status) values (?, ?, ?, ?, ?, ?, ?)", 
                        ["Account", self_account_id, amount, "Funds Transfer", "Funds Transfer to Account " + other_account_id, "Credit", "Success"],
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

                //procceed to debit other account
                connection.query("update account set account_balance = account_balance + ? where account_id = ?", [amount, other_account_id], function (error, results, fields) {
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
                  }
                  else{

                    console.log('debited other account!');
                    //add details to transaction table
                    connection.query("insert into transaction (channel, channel_number, amount, transaction, details, debit_credit, status) values (?, ?, ?, ?, ?, ?, ?)", 
                        ["Account", other_account_id, amount, "Funds Received", "Funds Receipt from Account " + self_account_id, "Debit", "Success"],
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
            });
        },
        accountToWallet: function(account_id, amount, wallet_id, callback){
            connection.beginTransaction(function(err) {
              if (err) { 
                return callback(err, null); 
                }
                //first credit account
              connection.query("update account set account_balance = account_balance - ? where account_id = ?", [amount, account_id], function (error, results, fields) {
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
                        ["Account", account_id, amount, "Funds Transfer", "Funds Transfer to Wallet " + wallet_id, "Credit", "Success"],
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

                //procceed to debit wallet
                connection.query("update wallet set wallet_balance = wallet_balance + ? where wallet_id = ?", [amount, wallet_id], function (error, results, fields) {
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
                  }
                  else{

                    console.log('debited wallet!');
                    //add details to transaction table
                    connection.query("insert into transaction (channel, channel_number, amount, transaction, details, debit_credit, status) values (?, ?, ?, ?, ?, ?, ?)", 
                        ["Wallet", wallet_id, amount, "Funds Received", "Funds Receipt from Account " + account_id, "Debit", "Success"],
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
            });
        },
        walletToAccount: function(wallet_id, amount, account_id, callback){
            connection.beginTransaction(function(err) {
              if (err) { 
                return callback(err, null); 
                }
                //first credit wallet
              connection.query("update wallet set wallet_balance = wallet_balance - ? where wallet_id = ?", [amount, wallet_id], function (error, results, fields) {
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

                    console.log('credited wallet!');
                    //add details to transaction table
                    connection.query("insert into transaction (channel, channel_number, amount, transaction, details, debit_credit, status) values (?, ?, ?, ?, ?, ?, ?)", 
                        ["Wallet", wallet_id, amount, "Funds Transfer", "Funds Transfer to Account " + account_id, "Credit", "Success"],
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

                //procceed to debit account
                connection.query("update account set account_balance = account_balance + ? where account_id = ?", [amount, account_id], function (error, results, fields) {
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
                  }
                  else{

                    console.log('debited account!');
                    //add details to transaction table
                    connection.query("insert into transaction (channel, channel_number, amount, transaction, details, debit_credit, status) values (?, ?, ?, ?, ?, ?, ?)", 
                        ["Account", account_id, amount, "Funds Received", "Funds Receipt from Wallet " + wallet_id, "Debit", "Success"],
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
            });
        },
        rechargeAirtime: function(Recharge, callback){
            connection.beginTransaction(function(err) {
              if (err) { 
                return callback(err, null); 
                }
                //first credit account
              connection.query("update account set account_balance = account_balance - ? where account_id = ?", [Recharge.amount, Recharge.account_id], function (error, results, fields) {
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
                        ["Account", Recharge.account_id, Recharge.amount, "Airtime Recharge", "Airtime Recharge to " + Recharge.phone, "Credit", "Success"],
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
    module.exports = Account;  