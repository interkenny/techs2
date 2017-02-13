var socket = io();
socket.on('numUsers', function (data) {
    console.log(data);
});

$(document).ready(function () {

    socket.on('page', function (data) {
        console.log(data.title + ' : ' + data.url);
        $('#title').text(data.title);
        $('#comment').text(data.comment1);
        $('#leftval').text(data.left);
        $('#rightval').text(data.right);

        $('#leftbtn').click(function () {
            console.log('left');
            socket.emit('mission', 'left');
        });
        $('#rightbtn').click(function () {
            console.log('right');
            socket.emit('mission', 'right');
        });

    });
});