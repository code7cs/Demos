// https://www.runoob.com/nodejs/nodejs-event.html

// var EventEmitter = require('events').EventEmitter;
// var event = new EventEmitter();
// event.on('some_event', function () {
//     console.log('some_event 事件触发');
// });
// setTimeout(function () {
//     event.emit('some_event');
// }, 1000);

// EventEmitter 的每个事件由一个事件名和若干个参数组成，事件名是一个字符串，通常表达一定的语义。对于每个事件，EventEmitter 支持 若干个事件监听器。
// 当事件触发时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。
// 让我们以下面的例子解释这个过程：
var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('someEvent', function (arg1, arg2) {
    console.log('listener1', arg1, arg2);
});
emitter.on('someEvent', function (arg1, arg2) {
    console.log('listener2', arg1, arg2);
});
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数');