/**
 * 채팅 스키마
 * room : 채팅방 아이디
 * user : 채팅을 한 사람
 * chat : 채팅 내역
 * img : 이미지 주소
 * createdAt : 채팅 시간
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
  room: {
    type: ObjectId,
    required: true,
    ref: 'Room'
  },
  user: {
    type: String,
    required: true
  },
  chat: String,
  img: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);