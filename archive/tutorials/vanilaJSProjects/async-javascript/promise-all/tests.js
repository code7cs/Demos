const assert = require('node:assert/strict');

const implementationName = process.argv[2] === 'exercise' ? 'exercise' : 'solution';
const promiseAll = require(`./${implementationName}`);

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
  assert.deepEqual(
    await promiseAll([delay(30, 'first'), delay(10, 'second'), delay(20, 'third')]),
    ['first', 'second', 'third'],
    'resolves values in original order'
  );

  assert.deepEqual(
    await promiseAll([1, Promise.resolve(2), 'three']),
    [1, 2, 'three'],
    'accepts promises and non-promise values'
  );

  assert.deepEqual(
    await promiseAll(new Set([Promise.resolve('a'), 'b'])),
    ['a', 'b'],
    'accepts any iterable input'
  );

  assert.deepEqual(await promiseAll([]), [], 'resolves an empty iterable');

  await assert.rejects(
    promiseAll([delay(30, 'late'), delay(5, new Error('boom'), true)]),
    /boom/,
    'rejects when any input rejects'
  );

  console.log(`promise-all ${implementationName} tests passed`);
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
