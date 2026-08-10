import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

const port = 4300;
let sequence = 100;
let paused = false;
const quotes = [
  ['FN 4.5', 99.78125],
  ['FN 5.0', 101.125],
  ['FN 5.5', 102.46875],
  ['UMBS 5.0', 100.9375],
  ['TBA 30Y 5.5', 102.0625],
  ['TBA 15Y 5.0', 101.53125],
].map(([symbol, price]) => makeQuote(symbol, price));

function makeQuote(symbol, price, dailyChange = 0) {
  return {
    symbol,
    price: +price.toFixed(5),
    bid: +(price - 0.015625).toFixed(5),
    ask: +(price + 0.015625).toFixed(5),
    dailyChange: +dailyChange.toFixed(5),
    updatedAt: new Date().toISOString(),
  };
}

const server = createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (request.method === 'OPTIONS') return response.end();
  if (request.method === 'GET' && request.url === '/api/prices/snapshot')
    return sendJson(response, { type: 'snapshot', sequence, quotes });
  if (request.method === 'POST' && request.url === '/api/prices/pause') {
    paused = !paused;
    return sendJson(response, { paused });
  }
  if (request.method === 'POST' && request.url === '/api/prices/burst') {
    for (let i = 0; i < 20; i++) broadcastNextQuote();
    return sendJson(response, { sent: 20 });
  }
  response.writeHead(404).end();
});

const sockets = new WebSocketServer({ server, path: '/ws/prices' });
sockets.on('connection', (socket) => socket.send(JSON.stringify({ type: 'ready' })));

function broadcastNextQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  const previous = quotes[index];
  const change = (Math.floor(Math.random() * 9) - 4) / 64;
  const quote = makeQuote(previous.symbol, previous.price + change, previous.dailyChange + change);
  quotes[index] = quote;
  sequence += 1;
  const message = JSON.stringify({ type: 'delta', sequence, quote });
  for (const socket of sockets.clients) if (socket.readyState === socket.OPEN) socket.send(message);
}

setInterval(() => {
  if (!paused) broadcastNextQuote();
}, 400);
server.listen(port, () =>
  console.log(`Realtime pricing server listening on http://localhost:${port}`),
);

function sendJson(response, body) {
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}
