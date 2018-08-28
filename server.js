// written by vivek
var express = require('express');
var mysql = require('mysql'); // include the module mysql
var app = express();
// connecting to Database
var pool = mysql.createPool({
host: 'localhost',
user: 'root',
password: 'root',
database: 'test'
});

app.get('/user', function(req, res){
var sql = 'SELECT * FROM `member`';
pool.query(sql, function(error, result){
if (error) throw error;
console.log('– USER TABLE — ' , result);
res.json(result);
});
});


app.listen(3000);
console.log('—– server is listening —–');
