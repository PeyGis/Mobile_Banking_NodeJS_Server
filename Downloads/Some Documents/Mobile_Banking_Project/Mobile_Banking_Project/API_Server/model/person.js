/**
 *@author Pages Coffie
 *@version Version 1.0
 *Created at 2018/05/26
 *Nsano Mobile Banking Project
 */  
    var db = require('../dbconnection'); //reference of dbconnection.js  
    var Person = {  
        getAllPerson: function(callback) {  
            return db.query("select * from person order by person_id DESC", callback);  
        },  
        getPersonById: function(id, callback) {  
            return db.query("select * from person where person_id=?", [id], callback);  
        }, 
        getPersonByPhone: function(phone, callback) {  
            return db.query("select * from person where phone=?", [phone], callback);  
        },   
        deletePerson: function(id, callback) {  
            return db.query("delete from person where person_id=?", [id], callback);  
        },  
        updatePerson: function(id, Person, callback) {  
            //return db.query("update Person set first_name=?,last_name=?, email=?, phone=? where person_id=?", [Person.first_name, Person.last_name, Person.email, Person.phone, id], callback);  
            return db.query("update person set ? where person_id=?", [Person, id], callback);  
        },
        changePIN: function(new_pin, person_id, callback) {  
            return db.query("update person set pin = ? where person_id=?", [new_pin, person_id], callback);  
        },
        changePhone: function(new_phone, person_id, callback) {  
            return db.query("update person set phone = ? where person_id=?", [new_phone, person_id], callback);  
        },
        addPerson: function(Person, callback) {  
            var person = {
                first_name: Person.first_name,
                last_name: Person.last_name,
                phone: Person.phone,
                email: Person.email,
                pin: Person.pin,
                status: 'Active'
            };
            return db.query("insert into person set ?", person, callback);  
        }
    };  
    module.exports = Person;  