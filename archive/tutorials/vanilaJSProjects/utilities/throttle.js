function throttle(callback, wait = 0) {
  let isWaiting = false;
  let lastArgs;
  let lastThis;

  return function throttled(...args) {
    if (isWaiting) {
      lastArgs = args;
      lastThis = this;
      return;
    }

    callback.apply(this, args);
    isWaiting = true;

    setTimeout(() => {
      isWaiting = false;

      if (lastArgs) {
        const queuedArgs = lastArgs;
        const queuedThis = lastThis;
        lastArgs = undefined;
        lastThis = undefined;
        throttled.apply(queuedThis, queuedArgs);
      }
    }, wait);
  };
}

if (typeof module !== 'undefined') {
  module.exports = throttle;
}

if (typeof window !== 'undefined') {
  window.throttle = throttle;
}
