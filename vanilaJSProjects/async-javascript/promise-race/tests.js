const assert = require('node:assert/strict');

const implementationName = process.argv[2] === 'exercise' ? 'exercise' : 'solution';
const promiseRace = require(`./${implementationName}`);

function delay(ms, value, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(value);
        return;
      }

      resolve(value);
    }, ms);
  });
}

async function runTests() {
  assert.equal(
    await promiseRace([delay(30, 'slow'), delay(5, 'fast')]),
    'fast',
    'resolves with the fastest fulfilled value'
  );

  assert.equal(
    await promiseRace([42, delay(5, 'later')]),
    42,
    'accepts non-promise values'
  );

  await assert.rejects(
    promiseRace([delay(20, 'late'), delay(5, new Error('fast failure'), true)]),
    /fast failure/,
    'rejects when the first settled input rejects'
  );

  let settled = false;
  promiseRace([]).then(
    () => {
      settled = true;
    },
    () => {
      settled = true;
    }
  );
  await delay(20);
  assert.equal(settled, false, 'leaves empty iterable pending');

  console.log(`promise-race ${implementationName} tests passed`);
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
