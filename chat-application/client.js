const socket = io();
const message = $('#message');
const form = $('form');
const inputBox = $('#m');
const online = $('.online');
const typing = $('.typing');
let isSelf = false; // 判断是否是自己发送的信息

nickname = prompt('please input your nickname:');

message.append(`<li>Welcome to ${nickname}</li>`);

socket.emit('user add', nickname);

form.submit(() => {
  isSelf = true;

  message.append(`<li class="self">${nickname}: ${inputBox.val()}</li>`);

  socket.emit('chat message', inputBox.val());
  socket.emit('user not typing');

  inputBox.val('');

  return false;
});

inputBox.keydown(() => {
  socket.emit('user typing', nickname);
});

inputBox.blur(() => {
  socket.emit('user not typing');
});

socket.on('chat message', (data) => {
  if(!isSelf) {
    message.append(`<li>${data.nickname}: ${data.msg}</li>`);
  }
  
  isSelf = false;
});

socket.on('user connect', (nickname) => {
  message.append(`<li>Notice: ${nickname} connects.</li>`);
});

socket.on('user disconnect', (nickname) => {
  message.append(`<li>Notice: ${nickname} disconnects.</li>`);
});

socket.on('user typing', (nickname) => {
  typing.html(`${nickname} is typing...`);

  typing.css('display', 'block');
});

socket.on('user not typing', () => {
  typing.css('display', 'none');
});

socket.on('user online', (nickname) => {
  if(!$(`.online li[user="${nickname}"]`).length) {
    online.append(`<li user="${nickname}">${nickname}</li>`);
  }
});

socket.on('user offline', (nickname) => {
  $(`.online li[user="${nickname}"]`).remove();
});
