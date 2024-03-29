const Room = require('../models/room');
const { dateFormatKST } = require('../utils/dateFormatKST');

const roomService = {};

// 모든 룸 조회
roomService.getAllRooms = async function () {
  // console.log('roomService.getAllRooms called');
  try {
    const roomList = await Room.find({});
    // console.log('roomList', roomList);
    return roomList;
  } catch (error) {
    // console.log('roomService.getAllRooms error', error);
    throw new Error(error.message);
  }
};

// 특정 키,값으로 룸 조회
roomService.checkRoom = async function (value, key) {
  // console.log('roomService.checkRoom called', value, key);
  try {
    const query = {};
    query[key] = value;
    const room = await Room.findOne(query);
    return room;
  } catch (error) {
    // console.log('roomService.checkRoom error', error);
    throw new Error('room not found');
  }
};

// 룸 생성
roomService.createRoom = async function (title, uid) {
  // console.log('roomService.createRoom called', title, uid);
  try {
    const now = await dateFormatKST();
    const room = new Room({
      title: title,
      owner: uid,
      created: now,
    });
    await room.save();
    return room;
  } catch (error) {
    // console.log('roomService.createRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 입장 -> members[]: user 추가
roomService.joinRoom = async function (room, user) {
  // console.log('roomService.joinRoom called', room, user);
  try {
    let memberUpdate = false;
    if (!room.members.includes(user._id)) {
      // console.log('room.joinRoom, not include yet', room.members);
      room.members.push(user._id);
      await room.save();
      memberUpdate = true;
      // console.log('room.joinRoom, now pushed', memberUpdate, room.members);
    }
    return { room, memberUpdate };
  } catch (error) {
    // console.log('roomService.joinRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 퇴장 -> members[]: user 제거
roomService.leaveRoom = async function (room, user) {
  // console.log('roomService.leaveRoom called', room.title, user.email);
  try {
    room.members.pull(user._id);
    await room.save();
    return room;
  } catch (error) {
    // console.log('roomService.leaveRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 오너 변경
roomService.changeOwner = async function (room, newOwnerId) {
  // console.log('roomService.changeOwner called', room, newOwnerId);
  try {
    room.owner = newOwnerId;
    await room.save();
    return room;
  } catch (error) {
    // console.log('roomService.changeOwner error', error);
    throw new Error(error.message);
  }
};

module.exports = roomService;
