const {
  authenticateSocket,
  // checkDuplicatedSocket,
  addConnectedSocket,
  deleteConnectedSocket,
} = require('./io-middlewares');
const userController = require('../controllers/user.controller');
const roomController = require('../controllers/room.controller');

// 연결된 모든 소켓 출력하는 함수
async function printAllSockets(io) {
  const allSockets = io.sockets.sockets;
  // console.log('allSockets', allSockets);
  console.log('-------- All connected sockets --------');
  for (const [socketId, socket] of allSockets) {
    console.log(
      `${socket.decoded.email} - ${socketId}, Connected: ${socket.connected}`
    );
  }
  console.log('----------------------------------------');
}

module.exports = function (io) {
  io.use(async (socket, next) => {
    await authenticateSocket(socket, next);
  }); // JWT 인증 미들웨어
  // io.use(async (socket, next) => {
  //   await checkDuplicatedSocket(socket, next);
  // }); // 1인1소켓 미들웨어

  io.on('connection', async (socket) => {
    // console.log('socket.decoded', socket.decoded);
    // console.log(socket.handshake.query);
    console.log(
      `Socket connected for ${socket.decoded.email}, by [${socket.handshake.query.reason}] : ${socket.id}`
    );
    await addConnectedSocket(socket.decoded.email, socket.id); // 소켓정보 배열에 추가(+목록 출력)
    await printAllSockets(io);
    await userController.updateConnectedUser(socket.decoded.email, socket.id);
    socket.emit(
      'users',
      'Someone connected',
      await userController.listAllUsers('Someone connected'),
      (res) => console.log(res)
    );

    socket.on('getUsers', async (cb) => {
      try {
        const userList = await userController.listAllUsers('UserList loaded');
        cb({ status: 'ok', data: userList });
      } catch (error) {
        console.error('Error fetching users : ', error);
        cb({ status: 'not ok', error: error });
      }
    });

    socket.on('getRooms', async (cb) => {
      try {
        const roomList = await roomController.getAllRooms();
        cb({ status: 'ok', data: roomList });
      } catch (error) {
        console.log('getRooms Error', error);
        cb({ status: 'not ok', error: error });
      }
    });

    socket.on('joinRoom', async (rid, cb) => {
      try {
        const room = await roomController.checkRoom(rid); //룸정보 찾기

        cb({ status: 'ok', data: { room: room } });
      } catch (error) {
        console.log('joinRoom Error', error);
        cb({ status: 'not ok', error: error });
      }
    });

    socket.on('logout', () => {
      console.log('Logout requested, disconnecting socket');
      socket.disconnect(true);
    });

    socket.on('disconnect', async (reason) => {
      await userController.updateDisconnectedUser(socket.id);
      socket.emit(
        'users',
        'Someone disconnected',
        await userController.listAllUsers('Someone disconnected'),
        (res) => console.log(res)
      );
      console.log(
        `Socket disconnected for ${socket.decoded.email}, by [${reason}] : ${socket.id}`
      );
      await deleteConnectedSocket(socket.id); // 소켓정보 배열에서 제거(+목록 출력)
      await printAllSockets(io);
    });
  });
};
