const sections = [
  {
    title: 'DOM Projects',
    projects: [
      {
        id: '01',
        projectName: 'Form Validator',
        url: 'dom-projects/form-validator/index.html',
      },
      {
        id: '02',
        projectName: 'Movie Seat Booking',
        url: 'dom-projects/movie-seat-booking/index.html',
      },
      {
        id: '03',
        projectName: 'Custom Video Player',
        url: 'dom-projects/video-player/index.html',
      },
      {
        id: '04',
        projectName: 'Currency Converter',
        url: 'dom-projects/currency-converter/index.html',
      },
      {
        id: '05',
        projectName: 'DOM Array Methods',
        url: 'dom-projects/dom-array-methods/index.html',
      },
      {
        id: '06',
        projectName: 'Landing Page',
        url: 'dom-projects/modal-menu-slider/index.html',
      },
      {
        id: '07',
        projectName: 'Hangman',
        url: 'dom-projects/hangman/index.html',
      },
      {
        id: '08',
        projectName: 'Meal Finder',
        url: 'dom-projects/meal-finder/index.html',
      },
      {
        id: '09',
        projectName: 'Expense Tracker',
        url: 'dom-projects/expense-tracker/index.html',
      },
      {
        id: '10',
        projectName: 'Custom Music Player',
        url: 'dom-projects/music-player/index.html',
      },
      {
        id: '11',
        projectName: 'Blog Post',
        url: 'dom-projects/blog-post/index.html',
      },
      {
        id: '12',
        projectName: 'Typing Game',
        url: 'dom-projects/typing-game/index.html',
      },
      {
        id: '13',
        projectName: 'Speech Text Reader',
        url: 'dom-projects/speech-reader/index.html',
      },
      {
        id: '14',
        projectName: 'Memory Cards',
        url: 'dom-projects/memory-cards/index.html',
      },
      {
        id: '15',
        projectName: 'Lyrics Search',
        url: 'dom-projects/lyrics-search/index.html',
      },
      {
        id: '16',
        projectName: 'Relaxer App',
        url: 'dom-projects/relaxer-app/index.html',
      },
      {
        id: '17',
        projectName: 'Breakout Game',
        url: 'dom-projects/breakout-game/index.html',
      },
      {
        id: '18',
        projectName: 'Sortable List',
        url: 'dom-projects/sortable-list/index.html',
      },
      {
        id: '19',
        projectName: 'Speak Number Guess',
        url: 'dom-projects/speak-number-guess/index.html',
      },
      {
        id: '20',
        projectName: 'New Year Countdown',
        url: 'dom-projects/new-year-countdown/index.html',
      },
      {
        id: '21',
        projectName: 'User Directory',
        url: 'dom-projects/user-directory/index.html',
      },
    ],
  },
  {
    title: 'Async JavaScript',
    projects: [
      {
        id: 'A1',
        projectName: 'Promise.all Exercise',
        url: 'async-javascript/promise-all/exercise.js',
      },
      {
        id: 'A2',
        projectName: 'Promise.race Exercise',
        url: 'async-javascript/promise-race/exercise.js',
      },
    ],
  },
  {
    title: 'Utilities',
    projects: [
      {
        id: 'U1',
        projectName: 'Debounce Helper',
        url: 'utilities/debounce.js',
      },
      {
        id: 'U2',
        projectName: 'Throttle Helper',
        url: 'utilities/throttle.js',
      },
      {
        id: 'U3',
        projectName: 'Bank System OOD',
        url: 'utilities/capital-one-bank-system-ood/bank-system-ood.js',
      },
    ],
  },
];

const renderProject = (item) => `
  <div class="col-md-6">
    <div class="alert alert-secondary" role="alert">
      ${item.id}. ${item.projectName}
      <button
        type="button"
        class="btn bg-light text-dark py-0 float-right"
      >
        <a href="${item.url}">Open</a>
      </button>
    </div>
  </div>
`;

const renderSection = (section) => `
  <section class="mb-5">
    <h2 class="h4 mb-3">${section.title}</h2>
    <div class="row justify-content-center">
      ${section.projects.map(renderProject).join('')}
    </div>
  </section>
`;

const renderPage = () => {
  const mainContentEl = document.querySelector("[data-selector='main-content']");
  const html = `
    <h1 class="p-4 text-center">Vanilla JavaScript Projects</h1>
    ${sections.map(renderSection).join('')}
  `;
  mainContentEl.innerHTML = html;
};

window.addEventListener('DOMContentLoaded', renderPage);
