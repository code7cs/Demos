function promiseAll(values) {
  return new Promise((resolve, reject) => {
    const items = Array.from(values);

    if (items.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(items.length);
    let remaining = items.length;

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          remaining -= 1;

          if (remaining === 0) {
            resolve(results);
          }
        },
        reject
      );
    });
  });
}

module.exports = promiseAll;
