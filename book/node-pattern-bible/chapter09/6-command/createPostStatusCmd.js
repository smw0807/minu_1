export function createPostStatusCmd(service, status) {
  let postId = null;

  // 명령(command)
  return {
    run() {
      postId = service.postUpdate(status);
    },
    undo() {
      if (postId) {
        service.destroyUpdate(postId);
        postId = null;
      }
    },
    serialize() {
      return {
        type: 'status',
        action: 'post',
        status: status,
      };
    },
  };
}
