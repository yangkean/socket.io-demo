const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      nickname: socket.nickname,
      msg: msg
    });
  });

  socket.on('user add', (nickname) => {
    socket.nickname = nickname;
    socket.online = true; // 当前用户在线

    socket.broadcast.emit('user connect', socket.nickname);

    const timer = setInterval(() => {
      if(socket.online) {
        io.emit('user online', socket.nickname);
      } else {
        clearInterval(timer);
      }
    }, 10)
  });

  socket.on('disconnect', () => {
    socket.online = false;

    socket.broadcast.emit('user disconnect', socket.nickname);

    io.emit('user offline', socket.nickname);
  });

  socket.on('user typing', () => {
    socket.broadcast.emit('user typing', socket.nickname);
  });

  socket.on('user not typing', () => {
    socket.broadcast.emit('user not typing');
  });
});

http.listen(3000, () => {
  console.log('Listening at port http://localhost:3000');
});