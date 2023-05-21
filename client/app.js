{
  const loginForm = document.getElementById('welcome-form');
  const messageSection = document.getElementById('messages-section');
  const messageList = document.getElementById('messages-list');
  const addMessageForm = document.getElementById('add-messages-form');
  const userNameInput = document.getElementById('username');
  const messageContentInput = document.getElementById('message-content');

  const socket = io();

  let userName;
  socket.on('message', ({ author, content }) => addMessage(author, content));
  socket.on('newUser', (userName) => addAnnouncement(userName, ' has joined the conversation!'));
  socket.on('userLeft', (userName) => addAnnouncement(userName, ' has left the conversation :('));
  
  function login() {
    if (userNameInput.value) {
      userName = userNameInput.value;
      loginForm.classList.remove('show');
      messageSection.classList.add('show');
      socket.emit('author', userName);
    }
    else {
      alert("Please input your login");
    }
  }
  
  function sendMessage() {
    const messageContent = messageContentInput.value;    
    if (messageContent) {
      addMessage(userName, messageContent);
      socket.emit('message', { author: userName, content: messageContent });
      messageContentInput.value = '';
    }
    else {
      alert("Please enter your message");
    }
  }

  function addMessage(author, content) {
    const messageHeader = document.createElement('h3');
    messageHeader.classList.add('message__author');
    if (author === userName) {
      messageHeader.textContent = 'You';
    }
    else {
      messageHeader.textContent = author.trim();
    }

    const messageContent = document.createElement('div');
    messageContent.classList.add('message__content');
    messageContent.textContent = content.trim();

    
    const newMessageHTML = document.createElement('li');
    newMessageHTML.classList.add('message', 'message--received');
    if (author === userName) {
      newMessageHTML.classList.add('message--self');
    }
    newMessageHTML.append(messageHeader, messageContent);

    messageList.append(newMessageHTML);
  }

  function addAnnouncement(user, content) {
    const messageHeader = document.createElement('h3');
    messageHeader.classList.add('message__author');
    messageHeader.textContent = 'chatBot';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message__content', 'announcement');
    messageContent.textContent = user + content;

    const newMessageHTML = document.createElement('li');
    newMessageHTML.classList.add('message', 'message--received');

    newMessageHTML.append(messageHeader, messageContent);
    messageList.append(newMessageHTML);
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    login();
  });

  addMessageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    sendMessage();
  })
}