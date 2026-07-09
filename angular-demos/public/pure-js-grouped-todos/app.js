const TODOS_URL = 'https://dummyjson.com/todos?limit=10&skip=80';

/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {string} todo
 * @property {boolean} completed
 * @property {number} userId
 */

/**
 * Groups todos by userId in one pass.
 * Time: O(n), Space: O(n)
 *
 * @param {Todo[]} todos
 * @returns {Map<number, Todo[]>}
 */
export function groupTodosByUser(todos) {
  return todos.reduce((groups, todo) => {
    const userTodos = groups.get(todo.userId) ?? [];
    userTodos.push(todo);
    groups.set(todo.userId, userTodos);
    return groups;
  }, new Map());
}

/**
 * @param {Map<number, Todo[]>} groupedTodos
 * @param {HTMLElement} container
 */
export function renderTodoGroups(groupedTodos, container) {
  const fragment = document.createDocumentFragment();

  const sortedGroups = [...groupedTodos.entries()].sort(
    ([firstUserId], [secondUserId]) => firstUserId - secondUserId,
  );

  for (const [userId, todos] of sortedGroups) {
    const card = document.createElement('article');
    card.className = 'user-card';

    const title = document.createElement('h2');
    title.textContent = `User #${userId}`;

    const list = document.createElement('ul');

    for (const todo of todos) {
      const item = document.createElement('li');
      item.textContent = todo.todo;

      if (todo.completed) {
        item.classList.add('completed');
      }

      list.appendChild(item);
    }

    card.append(title, list);
    fragment.appendChild(card);
  }

  container.replaceChildren(fragment);
}

async function fetchTodos() {
  const response = await fetch(TODOS_URL);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.todos)) {
    throw new Error('The API response did not contain a todos array');
  }

  return data.todos;
}

async function initialize() {
  const status = document.querySelector('#status');
  const container = document.querySelector('#todo-container');

  if (!(status instanceof HTMLElement) || !(container instanceof HTMLElement)) {
    return;
  }

  try {
    const todos = await fetchTodos();
    const groupedTodos = groupTodosByUser(todos);

    renderTodoGroups(groupedTodos, container);
    status.textContent = `${todos.length} todos across ${groupedTodos.size} users`;
  } catch (error) {
    console.error(error);
    status.textContent = 'Unable to load todos. Please try again.';
  }
}

initialize();
