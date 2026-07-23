function debounce(callback, wait = 0) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  };
}

if (typeof module !== 'undefined') {
  module.exports = debounce;
}

if (typeof window !== 'undefined') {
  window.debounce = debounce;
}
