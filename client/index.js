var CronJob = require('cron').CronJob;
const OneSignal = require('onesignal-node');
const dotenv = require('dotenv').config();
const queue = require('queue');

const q = queue({});

const client = new OneSignal.Client(process.env.APP_ID, process.env.API_KEY, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// push notification
const pushNotification = async (content) => {
  try {
    const res = await client.createNotification(content);
    console.log(res.body);
    q.push(res.body);
  } catch (error) {
    console.log(error.message);
  }
};
//

// view notifications
const viewNotifications = async () => {
  try {
    const notifications = await client.viewNotifications();
    console.log(notifications.body);
  } catch (error) {
    console.log(error.message);
  }
};

console.log('before running', new Date().toLocaleTimeString());
var job = new CronJob('*/10 * * * * *', function () {
  const d = new Date().toLocaleTimeString();
  console.log(d);
  //push notification
  pushNotification({
    contents: {
      en: 'hahaha',
    },
    included_segments: ['Subscribed Users'],
  });
  // view notifications
  // viewNotifications();
});
job.start();

// const io = require('socket.io-client');

// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pbmgiLCJpYXQiOjE2NDkwNDU3NjYsImV4cCI6MTY0OTA0NTk0Nn0.Xx6Pl-6VCOSWpXFWcgib-vM_UcPGPqGA2K6oL1bJH4Q';

// let socket = io('http://localhost:3000/message', {
//   extraHeaders: { authorization: token },
// });

// create Conversation
// socket.emit('createRoom', {
//   title: 'room6',
//   userId: 1,
// });
// socket.on('createdRoom', (data) => console.log(data));
//
// add Member
// socket.emit('joinRoom', {
//   userId: 2,
//   conversationId: 1,
// });
// socket.on('joinedRoom', (data) => console.log(data.room));
//
//send message
// socket.emit('new-message-to-server', {
//   conversationId: 1,
//   content: 'hey u',
//   userId: 1,
// });
// socket.on('new-message-to-client', (data) => {
//   console.log(data);
// });
// leave room
// socket.emit('leaveRoom', {
//   conversationId: 1,
//   room: 'room1',
//   userId: 1,
// });
// socket.on('leftRoom', (data) => {
//   console.log(data);
// });
