const users = [
  {
    name: 'Ada Lovelace',
    role: 'Frontend Engineer',
    city: 'London',
    email: 'ada@example.com',
  },
  {
    name: 'Grace Hopper',
    role: 'Computer Scientist',
    city: 'Arlington',
    email: 'grace@example.com',
  },
  {
    name: 'Katherine Johnson',
    role: 'Mathematician',
    city: 'White Sulphur Springs',
    email: 'katherine@example.com',
  },
  {
    name: 'Radia Perlman',
    role: 'Network Engineer',
    city: 'Portsmouth',
    email: 'radia@example.com',
  },
];

const userList = document.querySelector('[data-user-list]');
const searchInput = document.querySelector('[data-search]');

function userMatchesQuery(user, query) {
  const searchableText = `${user.name} ${user.role} ${user.city}`.toLowerCase();
  return searchableText.includes(query.trim().toLowerCase());
}

function renderUsers(query = '') {
  const matchingUsers = users.filter((user) => userMatchesQuery(user, query));

  if (matchingUsers.length === 0) {
    userList.innerHTML = '<p class="empty">No users match that search.</p>';
    return;
  }

  userList.innerHTML = matchingUsers
    .map(
      (user) => `
        <article class="user-card">
          <h2>${user.name}</h2>
          <p>${user.role}</p>
          <p>${user.city}</p>
          <a href="mailto:${user.email}">${user.email}</a>
        </article>
      `
    )
    .join('');
}

searchInput.addEventListener('input', (event) => {
  renderUsers(event.target.value);
});

renderUsers();
