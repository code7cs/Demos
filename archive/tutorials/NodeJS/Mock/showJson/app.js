const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

let rawdata = fs.readFileSync(path.join(__dirname, 'string.json'));
let people = JSON.parse(rawdata);

app.get('/', function(req, res) {
	res.send(people);
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000');
});
