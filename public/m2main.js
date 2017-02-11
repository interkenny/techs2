var socket = io();
socket.on('numUsers', function(data) {
    console.log(data);
});

var leftNum =0;
var rightNum = 0;
var cdtState = false;
var leftLedgend = null;
var rightLedgend = null;
var question =null;
var position = null;
var result = {left: null,right: null};

$(document).ready(function($){
    var pbl = $('#left_bar');
    var pbr = $('#right_bar');
    var lbl = $('#left_label');
    var lbr = $('#right_label');
    var cdt = $('#countdown');
    
    socket.on('page', function(data) {
        //初期化
        console.log(data);
        position = data.pos;
        leftNum = 0;
        rightNum = 0;
        leftLedgend = data.left;
        rightLedgend = data.right;
        question = data.question;    
        $('#left_ledgend').text(leftLedgend);
        $('#right_ledgend').text(rightLedgend);
        cdtState = true;
        
        //プログレスバー生成
        pbl.progressbar({
            value: 0,
            change: function() {
                lbl.text(pbl.progressbar('value') + '%');
            },
        }); 
        var pbl_id = setInterval(function(){
            //var pbv = pbl.progressbar('value');
            pbl.progressbar('value', leftNum);
            if (!cdtState) {
                clearInterval(pbl_id);
                result.left = leftNum;
            };
        },100);
        pbr.progressbar({
            value: 0,
            change: function() {
                lbr.text(pbr.progressbar('value') + '%');
            },    
        });
        var pbr_id = setInterval(function(){
            //var pbv = pbr.progressbar('value');
            pbr.progressbar('value', rightNum);
            if (!cdtState) {
                clearInterval(pbr_id);
                result.right = rightNum;
            };    
        },100);
        
        //投票データの取得
        socket.on('voted', function (data) {
            console.log(data);
            leftNum = data.left_side;
            rightNum = data.right_side;
            console.log(leftNum);
        });
        
        //質問の作成
        $("#terminal").lbyl({
            content: question,
            speed: 300,
            type: 'show',
            fadeSpeed: 500, // Only relevant when the 'type' is set to 'fade'
            finished: function(){ 
        	    cdt.TimeCircles({
                    "animation": "ticks",
                    "start_angle": 0,
                    "circle_bg_color": "#FFFFFF",
                    "use_background": true,
                    "text_size": 0.07,
                    "number_size": 0.28,
                    "fg_width": 0.07,
                    "count_past_zero": false,
                    "time": {
                        "Days":{"show": false},
                        "Hours": {"show":false},
                        "Minutes": {"show": false},
                        "Seconds": { "color": "red"}
                    }
                });
        	    cdtState = true;

                //カウントダウン後の処理
        	    cdt.TimeCircles({count_past_zero: false}).addListener(countdownComplete);
			    function countdownComplete(unit, value, total){
    			    if(total<=0){
    			        cdtState = false;
        			    //$(this).fadeOut('slow').replaceWith("<p id='timeup'>Time's Up!</p>");
        			    var nextPage = function(){
        			        cdt.TimeCircles().destroy();
        			        
        			        //フローチャートの実行
        			        if (position == 'Q1') {
        			            if (result.left == Math.max(result.left,result.right)) {
        			                socket.emit('result',{Q1:data.left});
        			            } else {
        			                socket.emit('result',{Q1:data.right});  
        			            };
        			            socket.emit('position','Q2');
        			            console.log('Q1 end !');
        			        } else if (position == 'Q2') {
        			            if (result.left == Math.max(result.left,result.right)) {
        			                socket.emit('result',{Q2:data.left});
        			                socket.emit('position','Q3');        			            
        			            } else {
        			                socket.emit('result',{Q2:data.right});
        			                socket.emit('position','Q4');        			            
        			            };        			            
        			            console.log('Q2 end!');
        			        } else if (position == 'Q3') {
        			            if (result.left == Math.max(result.left,result.right)) {
        			                socket.emit('result',{Q3:data.left});        			            
        			            } else {
        			                socket.emit('result',{Q3:data.right});         			            
        			            }; 
        			            socket.emit('position','result');        			            
        			            console.log('Q3 end !');
        			        } else {
        			            if (result.left == Math.max(result.left,result.right)) {
        			                socket.emit('result',{Q4:data.left});
        			            } else {
        			                socket.emit('result',{Q4:data.right});
        			            };
        			            socket.emit('position','result');        			            
        			            console.log('Q4 end !');
        			        }
        			    };
        			    setTimeout(nextPage,5000);
    			    }
			    };
		    }
        });
    });
});