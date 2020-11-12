buf = Buffer.alloc(256);
len = buf.write("www.google.com");

console.log("写入字节数 : " + len);