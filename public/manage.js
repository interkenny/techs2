$(document).ready( function(){
	var socket = io();
	var pos = null;
	
	//ユーザ数の表示
	socket.on('numUsers', function(data) {
		$('#numUsers').text("接続数： "+data.numUsers);
		console.log(data);
	});
	
	//ページ情報の表示
	socket.on('page', function(data) {
		console.log(data);
		pos = data.pos;
		$('#now tbody').remove();
		$('#now').after("<tbody></tbody>");
		$('#now').append('<tr><td>Position :</td><td>'+data.pos +'</td></tr>');
		$('#now').append('<tr><td>Title :</td><td>'+data.title+'</td></tr>');
		$('#now').append('<tr><td>Coment :</td><td>'+data.coment+'</td></tr>');
		$('#now').append('<tr><td>Question :</td><td>'+data.question+'</td></rt>');
		$('#now').append('<tr><td>Left :</td><td>'+data.left+'</td></tr>');
		$('#now').append('<tr><td>right :</td><td>'+data.right+'</td></tr>');
	});
												
	//ページ制御
	$('#control').append("<input type='radio' id='m1' name='box' title='M1' value='M1'>");
	$('#control').append("<input type='radio' id='q1' name='box' title='Q1' value='Q1'>");
	$('#control').append("<input type='radio' id='q2' name='box' title='Q2' value='Q2'>");
	$('#control').append("<input type='radio' id='q3' name='box' title='Q3' value='Q3'>");
	$('#control').append("<input type='radio' id='m3' name='box' title='M3' value='M3'>");						
	$('#control').zInput();
	$("input[name='box']:radio").change( function(){
		console.log($(this).val());
		socket.emit('position', $(this).val());
	});
	
	$('#btn').on('click', function(){
		socket.emit('reset','reset');
		$('#status').text("Executed reset");
		console.log('reset !');
	});
});