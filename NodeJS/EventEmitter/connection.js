// 以下实例通过 connection（连接）事件演示了 EventEmitter 类的应用。

var events = require('events');
var eventEmitter = new events.EventEmitter();

// listener #1
var listener1 = function listener1() {
	console.log('listener1 executed.');
};

// listener #2
var listener2 = function listener2() {
	console.log('listener2 executed.');
};

// Bind the connection event with the listner1 function
eventEmitter.addListener('connection', listener1);

// Bind the connection event with the listner2 function
eventEmitter.on('connection', listener2);

var eventListeners = eventEmitter.listenerCount('connection');
console.log(eventListeners + ' Listner(s) listening to connection event');

// Fire the connection event 
eventEmitter.emit('connection');

// Remove the binding of listner1 function
eventEmitter.removeListener('connection', listener1);
console.log('Listner1 will not listen now.');

// Fire the connection event 
eventEmitter.emit('connection');

eventListeners = eventEmitter.listenerCount('connection');
console.log(eventListeners + ' Listner(s) listening to connection event');

console.log('Program Ended.');
