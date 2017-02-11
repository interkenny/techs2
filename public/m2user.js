var socket = io();
socket.on('numUsers', function(data) {
	console.log(data);
});
$(document).ready( function(){
	$('#title').text('Sencond Mission_');
	$('#coment').text('Your answer is ...');
	
	socket.on('page', function(data) {
		console.log(data);
		$('.zInput').remove();
		$('.zInputWrapper').remove();
		$('#radio').append("<input type='radio' id='left_btn' name='box' value='left'>");
		$('#radio').append("<input type='radio' id='right_btn' name='box' value='right'>");
		$('#question').text(data.question);
		$('#left_btn').attr('title',data.left);
		$('#right_btn').removeAttr('title');		
		$('#right_btn').attr('title',data.right);		
		$('#radio').zInput();
	
		$("input[name='box']:radio").change( function(){
			console.log($(this).val());
			socket.emit('mission2', $(this).val());
		});
	});
});