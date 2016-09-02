module.exports = function(array, func) {
  if (array.length == 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let run = i => {
      return func(array[i])
        .then(res => {
          if (array.length > i+1) {
            return run(i+1);
          } else {
            return resolve();
          }
        })
        .catch(reject);
    };
    process.nextTick(() => run(0));
  });
}
