const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MPromise {
	FULFILLED_CALLBACK_LIST = [];
	REJECTED_CALLBACK_LIST = [];
	_status = PENDING;

	/**
     * 
     * @param {Function} fn (resolve, reject) =>
     * */
	constructor(fn) {
		// initial status is pending
		this.status = PENDING;
		this.value = null;
		this.reason = null;

		try {
			fn(this.resolve.bind(this), this.reject.bind(this));
		} catch (e) {
			this.reject(e);
		}
	}

	get status() {
		return this._status;
	}

	set status(newStatus) {
		// whenever we try to change status in resolve() or reject(), will trigger setter method.
		this._status = newStatus;
		switch (newStatus) {
			case FULFILLED: {
				this.FULFILLED_CALLBACK_LIST.forEach((cb) => {
					cb(this.value);
				});
				break;
			}
			case REJECTED: {
				this.REJECTED_CALLBACK_LIST.forEach((cb) => {
					cb(this.reason);
				});
				break;
			}
		}
	}

	resolve(value) {
		if (this.status === PENDING) {
			this.value = value;
			this.status = FULFILLED; // trigger setter status() {} here
		}
	}

	reject(reason) {
		if (this.status === PENDING) {
			this.reason = reason;
			this.status = REJECTED; // trigger setter status() {} here
		}
	}

	then(onFulfilled, onRejected) {
		const realOnFulfilled = this.isFunction(onFulfilled)
			? onFulfilled
			: (value) => {
					return value;
				};

		const realOnRejected = this.isFunction(onRejected)
			? onRejected
			: (reason) => {
					throw reason;
				};

		const promise2 = new MPromise((resolve, reject) => {
			const fulfilledMicrotask = () => {
				queueMicrotask(() => {
					try {
						const x = realOnFulfilled(this.value);
						this.resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e);
					}
				});
			};

			const rejectedMicrotask = () => {
				queueMicrotask(() => {
					try {
						const x = realOnRejected(this.reason);
						this.resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e);
					}
				});
			};

			switch (this.status) { // when excute .then, different status triggers different callbacks
				case FULFILLED: {
					// sync excute
					fulfilledMicrotask();
					break;
				}
				case REJECTED: {
					// sync excute
					rejectedMicrotask();
					break;
				}
				case PENDING: {
					// async excute, like setTimeout...
					// async
					this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
					this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
					break;
				}
			}
		});
		return promise2;
	}

	catch(onRejected) {
		return this.then(null, onRejected);
	}

	isFunction(val) {
		return typeof val === 'function';
	}

	resolvePromise(promise, x, resolve, reject) {   // this method is used to resolve x (x is the return value of onFulfilled or onRejected)
		if (promise === x) {
			return reject(new TypeError('The promise and the return value are the same'));
		}
		if (x instanceof MPromise) {
			// if x is a promise, recursively call resolvePromise
			queueMicrotask(() => {
				x.then((y) => {
					this.resolvePromise(promise2, y, resolve, reject);
				}, reject);
			});
		} else if (typeof x === 'object' || this.isFunction(x)) {
			// most common case !
			if (x === null) {
				return resolve(x);
			}
			let then = null;
			try {
				then = x.then;
			} catch (e) {
				reject(e);
			}

			if (this.isFunction(then)) {
				let called = false;
				try {
					then.call(
						x, // this
						(y) => {
							if (called) {
								return;
							}
							called = true; // make sure onFulfilled only excute once
							this.resolvePromise(promise2, y, resolve, reject);
						}, // onFulfilled
						(reason) => {
							if (called) {
								return;
							}
							called = true;
							reject(reason);
						} // onRejected
					);
				} catch (error) {
					if (called) {
						return;
					}
					reject(error);
				}
			} else {
				resolve(x);
			}
		} else {
			resolve(x);
		}
	}

	static resolve(value) {
		if (value instanceof MPromise) {
			return value;
		}
		return new MPromise((resolve) => {
			resolve(value);
		});
	}

	static reject(reason) {
		return new MPromise((resolve, reject) => {
			reject(reason);
		});
	}

	static race(promiseList) {
		return new MPromise((resolve, reject) => {
			const length = promiseList.length;
			if (length === 0) {
				return resolve();
			} else {
				for (let i = 0; i < length; i++) {
					MPromise.resolve(promiseList[i]).then(
						(value) => {
							return resolve(value);
						},
						(reason) => {
							return reject(reason);
						}
					);
				}
			}
		});
	}
}

const test = new MPromise((resolve, reject) => {
	setTimeout(() => {
		resolve(111);
	}, 1000);
}).then((value) => {
	console.log('then');
});

setTimeout(() => {
	console.log(test);
}, 3000);
