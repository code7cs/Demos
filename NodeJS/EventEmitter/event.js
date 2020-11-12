var events = require('events');
// create eventEmitter object
var eventEmitter = new events.EventEmitter();

// create an event handler
var connectHandler = function connected() {
	console.log('connection successful');

	// fire data_received event
	eventEmitter.emit('data_received');
};

// Bind the connection event with the handler
eventEmitter.on('connection', connectHandler);

// Bind the data_received event with the anonymous function
eventEmitter.on('data_received', function() {
	console.log('data received succesfully.');
});

// Fire the connection event
eventEmitter.emit('connection');

console.log('Program Ended.');
