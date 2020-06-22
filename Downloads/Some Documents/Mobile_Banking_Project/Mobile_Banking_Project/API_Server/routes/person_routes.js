/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */        
    var express = require('express');  
    var bcrypt = require('bcrypt'); 
    var router = express.Router();  
    var Person = require('../model/person');  

    //API route to fetch user details by id
    router.get('/user/:id?', function(req, res, next) {  
        if (req.params.id) {  
            Person.getPersonById(req.params.id, function(err, rows) {  
                if (err) {  
                    res.json(err);  
                } else {  
                    res.json(rows);  
                }  
            });  
        } else {  
            Person.getAllPerson(function(err, rows) {  
                if (err) {  
                    res.json(err);  
                } else {  
                    res.json(rows); 
                    console.log(rows);
                }  
            });  
        }  
    });  

    //Register user API route
    router.post('/user/', function(req, res, next) { 

        //generate a 4 digit pin
        var raw_password = Math.floor(1000 + Math.random() * 9000);
        raw_password = raw_password.toString().substring(0, 4);
        console.log(raw_password);

        //hash pin
        bcrypt.hash(raw_password, 10, function (err, data) {
            if(err){
                res.send({error:true, message: "Internal error occured"});
            } else{
                req.body.pin = data;

                //finally try adding user 
                Person.addPerson(req.body, function(err, result) { 
                    //handle when error 
                    if (err) {  
                        if(err.code == "ER_DUP_ENTRY"){
                            res.send({error:true, message: "Duplicate Phone Number"});  
                        } else{
                             res.send({error:true, message: "Internal Server Error"});  
                        }
                        
                    } else {  
                    //handle when success
                        if(result.affectedRows > 0){
                            res.send({error:false, message: "Registration successful PIN: " + raw_password});  

                        }
                    }  
                }); 

            }
            
        }) 
    });  

    // login route
    router.post('/login/', function(req, res, next) { 

        var phone = req.body.phone;

        //try getting user by phone
        Person.getPersonByPhone(req.body.phone, function(err, user){

            if(err){
                res.send({
                    error:true, 
                    message: "error occured while fetching data"
                });
            } else if (user[0] == null){
                res.send({
                    error:true, 
                    message: "User does not exist"
                });
            } else{
                //if user exists, compare password with the one saved in db
                var hashed_pin = user[0].pin;

                bcrypt.compare(req.body.pin, hashed_pin, function(error, result){
                    if(error){
                         res.send({
                            error:true, 
                            message: "PIN didn't match"
                        });
                    } else{

                        if(result == true){
                            res.send({ 
                            error:false, 
                            message: "Login successful", 
                            fname:user[0].first_name,  
                            user_id: user[0].person_id,
                            phone: user[0].phone,
                            email: user[0].email
                        });

                        } else{
                            res.send({ 
                            error:true, 
                            message: "PIN didn't match"
                        });
                        }
                        
                    }

                });
            }

        });

    }); 


    // change phone number
    router.post('/change_Phone/', function(req, res, next) { 

        if(req.body.person_id){
            //try getting user by phone
            Person.getPersonByPhone(req.body.old_phone, function(err, user){

                if(err){
                    res.send({
                        error:true, 
                        message: "error occured while fetching data"
                    });
                } else if (user[0] == null){
                    res.send({
                        error:true, 
                        message: "Invalid Old Phone"
                    });
                } else{
                 //now update person phone in db
                    Person.changePhone(req.body.new_phone, req.body.person_id, function(error, result){
                        if(error){
                          res.send({error:true, message: err.code});
                        }
                        if(result.affectedRows >0){
                             res.send({
                                error:false, 
                                message: "Phone successfully updated"
                            });
                        } else{
                            res.send({
                                error:true, 
                                message: "Couldn't update Phone"
                            });

                        }
                    });
                    
                }

            });

        }

    });

    // change PIN route
    router.post('/change_pin/', function(req, res, next) { 

        if(req.body.person_id){
            //get user by phone
            Person.getPersonById(req.body.person_id, function(err, user){
                if(err){
                res.send({
                    error:true, 
                    message: "error occured while fetching data"
                });
            } else if (user[0] == null){
                res.send({
                    error:true, 
                    message: "User does not exist"
                });
            } else{
                //if user exists, compare password with the one saved in db
                var hashed_pin = user[0].pin;
                console.log(hashed_pin);

                bcrypt.compare(req.body.old_pin, hashed_pin, function(error, result){
                    if(error){
                         res.send({
                            error:true, 
                            message: "Error occured while comparing PIN"
                        });
                    } else{

                        if(result == true){
                            //hash new pin
                            bcrypt.hash(req.body.new_pin, 10, function (err, data) {
                                if(err){
                                    res.send({error:true, message: err.code});
                                } else{
                                 
                                    //now update person pin in db
                                    Person.changePIN(data, req.body.person_id, function(error, result){
                                        if(error){
                                          res.send({error:true, message: err.code});
                                        }
                                        if(result.affectedRows >0){
                                             res.send({
                                                error:false, 
                                                message: "PIN successfully updated"
                                            });
                                        } else{
                                            res.send({
                                                error:true, 
                                                message: "Couldn't update PIN"
                                            });

                                        }
                                    });
                                }
                            });
                            
                        } else{
                            res.send({ 
                            error:true, 
                            message: "Incorrect Old PIN"
                        });
                        }
                        
                    }

                });
            }

            });

        }else{
            res.send({
                    error:true, 
                    message: "Missing person id"
                });
        }

    }); 

    router.delete('/user/:id', function(req, res, next) {  
        Person.deletePerson(req.params.id, function(err, count) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(count);  
            }  
        });  
    });  
    
    router.put('/user/:id', function(req, res, next) {  
        Person.updatePerson(req.params.id, req.body, function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    });  
    module.exports = router;  
    
