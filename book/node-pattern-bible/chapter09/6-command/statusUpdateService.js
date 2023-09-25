const statusUpdates = new Map();

// 대상(target)
export const statusUpdateService = {
  postUpdate(status) {
    const id = Math.floor(Math.random() * 1000000);
    statusUpdates.set(id, status);
    console.log(`Status posted: ${status} and id : ${id}`);
    return id;
  },

  destroyUpdate(id) {
    statusUpdates.delete(id);
    console.log(`Status removed: ${id}`);
  },
};
