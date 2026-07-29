import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>Angular interview practice</h1>
    <div class="grid">
      @for (x of exercises; track x.path) {
        <a [routerLink]="x.path"
          ><b>{{ x.title }}</b
          ><span>{{ x.summary }}</span></a
        >
      }
    </div>
  </main>`,
  styles: [
    `
      main {
        max-width: 900px;
        margin: auto;
        padding: 2rem;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      }
      a {
        display: grid;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
      }
    `,
  ],
})
export class PracticeHomeComponent {
  readonly exercises = [
    {
      path: 'search-input-event',
      title: 'Search 1: input event',
      summary: 'Filter using the native input event.',
    },
    {
      path: 'search-ngmodel',
      title: 'Search 2: ngModel',
      summary: 'Filter using two-way binding.',
    },
    {
      path: 'search-reactive',
      title: 'Search 3: Reactive Forms',
      summary: 'Filter using valueChanges and RxJS.',
    },
    { path: 'search-sort', title: 'Search and sort', summary: 'Filter and sort transactions.' },
    {
      path: 'group-aggregate',
      title: 'Group and aggregate',
      summary: 'Calculate category totals.',
    },
    { path: 'build-tree', title: 'Build a tree', summary: 'Turn flat records into a hierarchy.' },
    { path: 'debounce', title: 'Debounce', summary: 'Delay noisy input with RxJS.' },
    {
      path: 'request-state',
      title: 'Request state',
      summary: 'Loading, errors, and stale requests.',
    },
    {
      path: 'interactive-list',
      title: 'Interactive list',
      summary: 'Add, update, and remove items.',
    },
    { path: 'tree-traversal', title: 'Tree traversal', summary: 'Search a nested hierarchy.' },
  ];
}
