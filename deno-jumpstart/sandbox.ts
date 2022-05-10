// Reading files
// const decoder = new TextDecoder('utf-8');
// const data = await Deno.readFile('readme.txt');
// console.log(decoder.decode(data));

// const data = await Deno.readTextFile('readme.txt');
// console.log(data);

// Writing files
// const encoder = new TextEncoder();
// const text = 'hello again, code7cs';
// await Deno.writeFile('readme.txt', encoder.encode(text));

// Renaming and removing files
// await Deno.rename('readme.txt', 'deleteme.txt');
// await Deno.remove('deleteme.txt');

// Fetch API
const res = await fetch('https://swapi.dev/api/films');
const data = await res.json();

console.log(data);