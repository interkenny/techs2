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
/*app.use("/css", static(__dirname + '/css'));
app.use("/js", static(__dirname + '/js'));*/

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.get('/', function (req,res){
    res.render('user.html');
});
app.get('/screen', function(req,res){
    res.render('screen.html');
});
app.get('/manage', function(req,res){
    res.render('manage.html');
});

// livehack

//初期化
var numUsers = -1;
var leftNum = 0;
var rightNum = 0;
var state = 'M1';
var result = {};
var page = {
    m1:{pos: 'M1',title:'First Mission_',comment1: 'タップデ数字ヲ調整シロ',comment2: 'タップで数字を調整シ、3秒マテ', question: '解除コード：', comment4: 'Over! マイナスオセ！', stop: 'stop', success: 'Success!', left: '－', right:'＋'},
    q1: {pos: 'Q1',title:'Second Mission_',comment1: '意思ヲアタエロ',question: 'あなたにとって人形とは？',left: '飾り',right:'癒し'},
    q2: {pos: 'Q2',title:'Second Mission_',comment1: '意思ヲアタエロ',question: '世界を救うのは？',left: '平和',right: '平等'},
    q3: {pos: 'Q3',title:'Second Mission_',comment1: '意思ヲアタエロ',question: 'それを守るにはどちらが必要？',left: '武器',right: '言葉'},
    q4: {pos: 'Q4',title:'Second Mission_',comment1: '意思ヲアタエロ',question: 'あなたの無限はどちらに存在する？',left: '脳内',right: '宇宙'},
    m3: {pos:'M3',title:'Last Mission_',comment1: 'エネルギーヲチャージシロ',question: '回タップ！', value: '1000', left:'－１', right:'＋１'}
};

io.on('connection', function (socket) {    
    ++numUsers;
    var id = socket.id;
    socket.emit('numUsers',{numUsers: numUsers});
    console.log(numUsers);
    if (state == 'M1') {
        io.to(id).emit('page',page.m1);    
    } else if (state == 'Q1') {
        io.to(id).emit('page',page.q1);    
    } else if (state == 'Q2') {
        io.to(id).emit('page',page.q2);    
    } else if (state == 'Q3') {
        io.to(id).emit('page',page.q3);    
    } else if (state == 'Q4') {
        io.to(id).emit('page',page.q4);
    } else if (state == 'M3') {
        io.to(id).emit('page',page.m3);  
    } else {
        
    }
    
    socket.on('position', function(data) {
        console.log(data);
        state = data;
        leftNum = 0;
        rightNum = 0;
        if (state == 'M1') {
            io.emit('page',page.m1);
        } else if (state == 'Q1') {
            io.emit('page',page.q1);
        } else if (state == 'Q2') {
            io.emit('page',page.q2);    
        } else if (state == 'Q3') {
            io.emit('page',page.q3);    
        } else if (state == 'Q4') {
            io.emit('page',page.q4);    
        } else if (state == 'M3') {
           io.emit('page',page.m3);  
        } else {
            
        }  
    });

    socket.on('reset', function(data){
        console.log(data);
        io.emit('reset','reset');
    });
    
  // when the client emits 'mission2', this listens and executes
  socket.on('mission', function (data) {
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
