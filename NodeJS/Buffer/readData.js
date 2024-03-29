buf = Buffer.alloc(26);
for (var i = 0; i < 26; i++) {
    buf[i] = i + 97;
}

console.log(buf.toString('ascii')); // 输出: abcdefghijklmnopqrstuvwxyz
console.log(buf.toString('ascii', 0, 5)); //使用 'ascii' 编码, 并输出: abcde
console.log(buf.toString('utf8', 0, 5)); // 使用 'utf8' 编码, 并输出: abcde
console.log(buf.toString(undefined, 0, 5)); // 使用默认的 'utf8' 编码, 并输出: abcde