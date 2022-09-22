function delayError(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Error after ${milliseconds}`));
    }, milliseconds);
  });
}

async function playingWithErros(throwSyncError) {
  try {
    if (throwSyncError) {
      throw new Error('This is a asyncronous error');
    }
    await delayError(1000);
  } catch (err) {
    console.error(`We have an error : ${err.message}`);
  } finally {
    console.log('Done');
  }
}

playingWithErros(false);

module.exports = {
  delayError,
};
