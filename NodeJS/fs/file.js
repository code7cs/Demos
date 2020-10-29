var fs = require("fs");

// 异步读取
fs.readFile('input.txt', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("异步读取: " + data.toString());
});

// 同步读取
var data = fs.readFileSync('input.txt');
console.log("同步读取: " + data.toString());

console.log("程序执行完毕。");

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
