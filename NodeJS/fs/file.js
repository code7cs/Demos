var fs = require('fs');

// async
fs.readFile('input.txt', function(err, data) {
	if (err) {
		return console.error(err);
	}
	console.log('async: ' + data.toString());
});

// sync
var data = fs.readFileSync('input.txt');
console.log('sync: ' + data.toString());

console.log('program ended.');

// fs.open(path, flags[, mode], callback)
// fs.stat(path, callback)
// fs.writeFile(file, data[, options], callback)
// fs.read(fd, buffer, offset, length, position, callback)
// fs.close(fd, callback)
// fs.ftruncate(fd, len, callback)
// fs.unlink(path, callback)
// fs.unlink(path, callback)
// fs.readdir(path, callback)
// fs.rmdir(path, callback)
