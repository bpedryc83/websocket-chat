const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const users = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('author', (userName) => {
    users.push( { author: userName, id: socket.id } )
    socket.broadcast.emit('newUser', userName);
  });
    
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    if ( users.length > 0 ) {
      const objectToSearch = users.find(user => user.id === socket.id);
      socket.broadcast.emit('userLeft', objectToSearch.author);
      const arrayElementIndex = users.indexOf(objectToSearch);
      users.splice(arrayElementIndex, 1);
    }
  });
  
  console.log('I\'ve added a listener on message and disconnect events \n');
});