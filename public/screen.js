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
var mission = null;
var voted = {left: null,right: null};
var result = {};
var pageArray = ['Q1','Q2','Q3','Q4'];
//var max = 200; → data.value
var code = 138;
var start = 100;
var gauge = null;

$(document).ready(function($){
    var title = $('#title');
    var comment = $('#comment');
    var pbl = $('#left_bar');
    var pbr = $('#right_bar');
    var lbl = $('#left_label');
    var lbr = $('#right_label');
    var cdt = $('#countdown');
    
    //ルーティング処理   
    socket.on('page', function(data) {
        //初期化
        console.log("ルーティング " + data.comment1);
        if (pageArray.indexOf(data.pos) >= 0) {
            mission = 'M2';
            position = data.pos;
        } else {
            mission =data.pos;
        }
        leftNum = 0;
        rightNum = 0;
        title.text(data.title);
        
        //M1の設定
        if (mission == 'M1') {
            console.log('M1 start !');
            comment.text(data.comment1);
            $('.label').remove();
            $('#gauge').remove();
            $('#message').text(data.question + ' ' + code);
            $('#code').text(start);
            //cdt.attr('data-timer','4');
            window.odometerOptions = {
                duration: 1000,
                animation: 'count'
            };
            
        //M2の設定
        } else if (mission == 'M2') {
            console.log('M2 start !');
            comment.text(data.comment1);
            $('#code').remove();
            $('#advice').remove();
            $('#message').remove();
            leftLedgend = data.left;
            rightLedgend = data.right;
             $('#left_ledgend').text(leftLedgend);
            $('#right_ledgend').text(rightLedgend);
            cdtState = true;
        
            //プログレスバー生成
            pbl.progressbar({
                value: 0,
                change: function() {
                    lbl.text(pbl.progressbar('value') + '%');
                }
            }); 
            var pbl_id = setInterval(function(){
                //var pbv = pbl.progressbar('value');
                pbl.progressbar('value', leftNum);
                if (!cdtState) {
                    clearInterval(pbl_id);
                    voted.left = leftNum;
                }
            },100);
            pbr.progressbar({
                value: 0,
                change: function() {
                    lbr.text(pbr.progressbar('value')+'%');
                }
            });
            var pbr_id = setInterval(function(){
                //var pbv = pbr.progressbar('value');
                pbr.progressbar('value', rightNum);
                if (!cdtState) {
                    clearInterval(pbr_id);
                    voted.right = rightNum;
                }
            },100);
        
            //質問の作成
            $("#terminal").lbyl({
                content: data.question,
                speed: 300,
                type: 'show',
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
        			                if (voted.left == Math.max(voted.left,voted.right)) {
        			                    result.q1 = data.left;
        			                } else {
        			                    result.q1 = data.right;
        			                }
        			                socket.emit('position','Q2');
        			                console.log('Q1 end !');
        			            } else if (position == 'Q2') {
        			                if (voted.left == Math.max(voted.left,voted.right)) {
        			                    result.q2 = data.left;
        			                    socket.emit('position','Q3');        			            
        			                } else {
        			                    result.q2 = data.right;
        			                    socket.emit('position','Q4');        			            
        			                }
        			                console.log('Q2 end!');
        			            } else if (position == 'Q3') {
        			                if (voted.left == Math.max(voted.left,voted.right)) {
        			                    result.q3 = data.left;        			            
        			                } else {
        			                    result.q3 = data.right;         			            
        			                }
        			                $.magnificPopup.open({
  			                              items:{src:$( "<div id='titlecall' class='white-popup'>イッキョクメハ、、、<br>『Kill The DJ』</div>")},
    		                                type:'inline',
    		                            showCloseBtn: false,
    		                            callbacks: {
    			                            open:function(){
    				                            console.log('open');
    			                            },
    			                            close:function(){
    				                            console.log('close');
    			                            }
    		                            }
  		                            });
  		                            function titlecall(){
  		                              $.magnificPopup.close();
  		                              socket.emit('position','M3');        			            
        			                  console.log('Q3 end !');
        			                }
  		                            setTimeout(titlecall,10000);
        			            } else {
        			                if (voted.left == Math.max(voted.left,voted.right)) {
        			                    result.q4 = data.left;
        			                } else {
        			                    result.q4 = data.right;
        			                }
        			                $.magnificPopup.open({
  			                              items:{src:$( "<div id='titlecall' class='white-popup'>イッキョクメハ、、、<br>『Astroboy』</div>")},
    		                                type:'inline',
    		                            showCloseBtn: false,
    		                            callbacks: {
    			                            open:function(){
    				                            console.log('open');
    			                            },
    			                            close:function(){
    				                            console.log('close');
    			                            }
    		                            }
  		                            });
  		                            function titlecall(){
  		                              $.magnificPopup.close();
  		                              socket.emit('position','M3');        			            
        			                  console.log('Q4 end !');
        			                }
  		                            setTimeout(titlecall,10000);
        			            }
        			        };
        			        setTimeout(nextPage,5000);
    			        }
			        }
		        }
            });
            
        //M3の設定
        } else {
            //初期化

            $('#code').remove();
            $('#advice').remove();
            comment.text(data.comment1);
            $('#message').text(data.value + data.question);
            $('#terminal').text('');
            $('#left_bar').remove();
            $('#right_bar').remove();
            $('#left_ledgend').text('');
            $('#right_ledgend').text('');
            $('.label').remove();
            $('#question').after("<div id='gauge' class='epoch' style='margin: 1em auto; height:350px'></div>");

            gauge = $('#gauge').epoch({
                tickSize: 50,
				ticks: 20,
    			type: 'time.gauge',
    			value: 0,
    			fps: 30,
                domain: [ 0, data.value ]
    		});
    	}
    });
    
        //投票データの取得
    socket.on('voted', function (data) {
        //M1用の処理
        if (mission == 'M1') {
            console.log(data + 'M1');
            var number = start + data.right_side - data.left_side;
            var diff = code - number;
            $('#code').text(number);
            if ( (diff) < 0) {
                $('#advice').text("Over ! マイナスヲオセ");
                if (cdtState == true){
                    cdt.TimeCircles().destroy();
                    cdtState = false;
                }
            } else if ((diff) == 0) {
                $('#advice').text('');
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
                cdt.TimeCircles({count_past_zero: false}).addListener(countdownComplete);
			    function countdownComplete(unit, value, total){
			        if (total <= 0){
			            $.magnificPopup.open({
			                items:{src:$( "<div id='titlecall' class='white-popup'>First Mission Complete !</div>")},
    		                type:'inline',
    		                showCloseBtn: false,
    		                callbacks: {
    			                open:function(){
    				                console.log('open');
    			                },
    			                close:function(){
    				                console.log('close');
    			                }
    		                }
    		            });
    		            function nextPage(){
    		                cdt.TimeCircles().destroy();
    		                $.magnificPopup.close();
    		                socket.emit('position','Q1');
    		                console.log('M1 end !');
    		            };
    		            setTimeout(nextPage,5000);
    		        }
    		    }
    		} else {
    		    $('#advice').text("Under ! プラスヲオセ");
    		    if (cdtState == true){
    		        cdt.TimeCircles().destroy();
                    cdtState = false;
                }
            }

        //M2の処理  
        } else if (mission =='M2') {
            console.log(data + 'M2');
            leftNum = data.left_side;
            rightNum = data.right_side;
            
        //M３の処理
        } else {
            console.log(data);
    		var enagy = (data.right_side - data.left_side)/data.value;
    		console.log(enagy);
    		if (enagy <= 1) {
    		    gauge.push(enagy);
    		} else {
    		      $.magnificPopup.open({
    		        removableDelay: 500,
    		        items:{src:$( "<div id='complete' class='white-popup'>Mission Complete...</div>")},
    		        type:'inline',
    		        showCloseBtn: false,
    		        callbacks: {
    		            open:function(){
    		                console.log('open');
    		            },
    		            close:function(){
    		                console.log('close');
    		            }
    		        }
    		    });
    		    function titlecall(){
    		        $.magnificPopup.close();
    		        console.log('M3 end !');
    		    }
    		    setTimeout(titlecall,30000);
    		}
    	}
    }); 
    
    //M1でリセットされた場合の処理
    socket.on('reset', function(data){
        console.log(data);
        $('#code').text(code);
        $('#advice').text('');
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
                    
        cdt.TimeCircles({count_past_zero: false}).addListener(countdownComplete);
		function countdownComplete(unit, value, total){
			if (total <= 0){
			    $.magnificPopup.open({
			        items:{src:$( "<div id='titlecall' class='white-popup'>First Mission Complete !</div>")},
    		        type:'inline',
    		        showCloseBtn: false,
    		        callbacks: {
    			        open:function(){
    				        console.log('open');
    			        },
    			        close:function(){
    				        console.log('close');
    			        }
    		        }
    		    });
    		    function nextPage(){
    		        cdt.TimeCircles().destroy();
    		        $.magnificPopup.close();
                    socket.emit('position','Q1');        			            
        			console.log('M1 end !');
        	    }
                setTimeout(nextPage,5000);
            }
        }
    });                
});