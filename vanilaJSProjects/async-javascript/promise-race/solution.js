function promiseRace(values) {
  return new Promise((resolve, reject) => {
    for (const item of values) {
      Promise.resolve(item).then(resolve, reject);
    }
  });
}

module.exports = promiseRace;
