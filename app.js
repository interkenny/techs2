// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'public'));
app.engine('htm', require('ejs').renderFile); 
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.get('/', function (req,res){
    res.render('m2user.html');
});
app.get('/screen', function(req,res){
    res.render('m2main.html');
});

// livehack mission 2

var numUsers = -1;
var leftNum = 0;
var rightNum = 0;
var state = 'Q1';
var result = {};
var page = {
    q1: {pos: 'Q1',question: 'あなたにとって人形とは？',left: '飾り',right:' 癒し'},
    q2: {pos: 'Q2',question: '世界を救うのは？',left: '平和',right: '平等'},
    q3: {pos: 'Q3',question: 'それを守るにはどちらが必要？',left: '武器',right: '言葉'},
    q4: {pos: 'Q4',question: 'あなたの無限はどちらに存在する？',left: '脳内',right: '宇宙'},    
};

io.on('connection', function (socket) {    
    ++numUsers;
    var id = socket.id;
    socket.emit('numUsers',{numUsers: numUsers});
    console.log(numUsers);
    if (state == 'Q1') {
        io.to(id).emit('page',page.q1);    
    } else if (state == 'Q2') {
        io.to(id).emit('page',page.q2);    
    } else if (state == 'Q3') {
        io.to(id).emit('page',page.q3);    
    } else if (state == 'Q4') {
        io.to(id).emit('page',page.q4);
    } else if (state == 'result') {
         
    } else {
        io.to(id).emit('page',page.q1);
    }
    
    socket.on('position', function(data) {
        console.log(data);
        state = data;
        leftNum = 0;
        rightNum = 0;
        if (state == 'Q1') {
            io.emit('page',page.q1);    
        } else if (state == 'Q2') {
            io.emit('page',page.q2);    
        } else if (state == 'Q3') {
            io.emit('page',page.q3);    
        } else if (state == 'Q4') {
            io.emit('page',page.q4);    
        } else {
            io.emit('page',page.q1);
        }  
    });

    socket.on('result', function(data){
        result = data;
        console.log(result);
    });
    
  // when the client emits 'mission2', this listens and executes
  socket.on('mission2', function (data) {
    console.log('Mission 2 !');
    console.log(data);
    // we tell the client to execute 'voting'
    if (data == 'left'){
        ++leftNum;
        console.log('left: ' + leftNum);
    } else {
        ++rightNum;
        console.log('right: ' + rightNum);    }
    socket.broadcast.emit('voted', {
      left_side: leftNum,
      right_side: rightNum
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('numUsers', {numUsers: numUsers});
  });
});
