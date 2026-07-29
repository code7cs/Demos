var buffer1 = Buffer.from(('AAA'));
var buffer2 = Buffer.from(('BBB'));
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log("buffer3 content: " + buffer3.toString());