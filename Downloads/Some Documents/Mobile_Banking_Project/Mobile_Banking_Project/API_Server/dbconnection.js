
var mysql = require('mysql');  
var connection = mysql.createPool({  
    host: 'localhost',  
    user: 'root',  
    password: '',  
    database: 'nsano_bank_app'  
});  
module.exports = connection;  