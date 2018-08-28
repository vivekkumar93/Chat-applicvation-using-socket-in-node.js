var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ent = require('ent'); // Blocks HTML characters (security equivalent to htmlentities in PHP)
var mysql = require('mysql'); // include module mysql

// Connect Database
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

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/error', function(req, res){
  res.sendFile(__dirname + '/error.html');
});

app.get('/dashboard', function(req, res){
	
	
	var sql_count = "select account,count(message) as count from member group by account";
	pool.query(sql_count, function(error, result){
                if(result.length === 0 || error) {
                    var destination = '/error';
                    socket.emit('redirect', destination);
                } else {
                    // console.log(result);
					var table;
				for(var i=0; i<result.length; i++){
					table +='<tr><td>'+ (i+1) +'</td><td>'+ result[i].account +'</td><td>'+ result[i].count +'</td></tr>';
				}
					  table ='<table border="1"><tr><th>Nr.</th><th>Name</th><th>Message Count</th></tr>'+ table +'</table>';
					return res.send(table);
                }  
            });
			
	
});

io.on('connection', function(socket, username){
    
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username) {
        username = ent.encode(username);
        
        if (username === '' ){
            var destination = '/';
            socket.emit('redirect', destination);
        } else{
             var sql = "SELECT * FROM `member` WHERE account = '" + username + "' AND password = '" + 123456 + "'";
        
            pool.query(sql, function(error, result){
                if(result.length === 0 || error) {
                    var destination = '/error';
                    socket.emit('redirect', destination);
                } else {
                    console.log('– MEMBER — ' , result[0]);
                    socket.username = username;
                    socket.broadcast.emit('new_client', username); 
                }  
            });
        }
    });
    
    socket.on('chat_message', function(message){
    message = ent.encode(message);
	var rever = [];
	var splitter = message.split(' ');
	var reverse_message = splitter.reverse();
	var str = reverse_message.join(" ");
	// console.log(str)
	// console.log(message)
    io.emit('chat_message', {username: socket.username, message: message});
    io.emit('chat_message_reverse', {username: 'Reverse Chat', message: str});
	
	var sql_insert = "insert into member(account,password,message) values('"+socket.username+"','123456','"+message+"')";
	pool.query(sql_insert, function(error, result){
                if(result.length === 0 || error) {
                    var destination = '/error';
                    socket.emit('redirect', destination);
                } else {
                    // console.log('– MEMBER — ' , result[0]);
                    console.log(result);
                    // socket.username = username;
                    // socket.broadcast.emit('new_client', username); 
                }  
            });
    });
  
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//var app = require('express')(),
//    server = require('http').createServer(app),
//    io = require('socket.io').listen(server),
//    ent = require('ent'), // Blocks HTML characters (security equivalent to htmlentities in PHP)
//    fs = require('fs');
//
//// Loading the page index.html
//app.get('/', function (req, res) {
//  res.sendfile(__dirname + '/index.html');
//});

//io.sockets.on('connection', function (socket, username) {
//    // When the username is received it’s stored as a session variable and informs the other people
//    socket.on('new_client', function(username) {
//        username = ent.encode(username);
//        socket.username = username;
//        socket.broadcast.emit('new_client', username);
//    });
//
//    // When a message is received, the client’s username is retrieved and sent to the other people
//    socket.on('message', function (message) {
//        message = ent.encode(message);
//        socket.broadcast.emit('message', {username: socket.username, message: message});
//    }); 
//});

