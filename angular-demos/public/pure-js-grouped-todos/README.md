# Pure JavaScript grouped todos

Open `/pure-js-grouped-todos/` while the Angular development server is running.

The solution separates the problem into three steps:

1. Fetch and validate the API response.
2. Group todos by `userId` with a `Map` in O(n) time.
3. Render one safe DOM card per user with `createElement` and `textContent`.

Using DOM APIs instead of `innerHTML` avoids injecting API strings as markup. A `DocumentFragment` batches the cards before inserting them into the page.
