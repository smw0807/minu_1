export const jsonMiddleware = function () {
  return {
    // 입력으로 수신된 메세지를 역 직렬화
    inbound(message) {
      return JSON.parse(message.toString());
    },
    // 데이터를 문자열로 직렬화한 다음 버퍼로 변환
    outbound(message) {
      return Buffer.from(JSON.stringify(message));
    },
  };
};
