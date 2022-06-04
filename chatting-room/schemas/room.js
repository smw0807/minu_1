/**
 * 채팅방 스키마
 * title : 방제목
 * max : 최대 수용인원 (기본값 10명, 최소 2명)
 * owner : 방장
 * password : 비밀번호
 * createdAt : 생성시간
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  max: {
    type: Number,
    required: true,
    default: 10,
    min: 2
  },
  owner: {
    type: String,
    required: true
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Room', roomSchema);