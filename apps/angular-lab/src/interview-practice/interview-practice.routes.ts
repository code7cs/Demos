import { Routes } from '@angular/router';
import { PracticeHomeComponent } from './practice-home.component';

export const INTERVIEW_PRACTICE_ROUTES: Routes = [
  { path: '', component: PracticeHomeComponent },
  {
    path: 'search-sort',
    loadComponent: () =>
      import('./01-search-sort/search-sort.component').then((m) => m.SearchSortComponent),
  },
  {
    path: 'group-aggregate',
    loadComponent: () =>
      import('./02-group-aggregate/group-aggregate.component').then(
        (m) => m.GroupAggregateComponent,
      ),
  },
  {
    path: 'build-tree',
    loadComponent: () =>
      import('./03-build-tree/build-tree.component').then((m) => m.BuildTreeComponent),
  },
  {
    path: 'debounce',
    loadComponent: () =>
      import('./04-debounce/debounce.component').then((m) => m.DebounceComponent),
  },
  {
    path: 'request-state',
    loadComponent: () =>
      import('./05-request-state/request-state.component').then((m) => m.RequestStateComponent),
  },
  {
    path: 'interactive-list',
    loadComponent: () =>
      import('./06-interactive-list/interactive-list.component').then(
        (m) => m.InteractiveListComponent,
      ),
  },
  {
    path: 'tree-traversal',
    loadComponent: () =>
      import('./07-tree-traversal/tree-traversal.component').then((m) => m.TreeTraversalComponent),
  },
  {
    path: 'search-input-event',
    loadComponent: () =>
      import('./08-search-input-event/search-input-event.component').then(
        (m) => m.SearchInputEventComponent,
      ),
  },
  {
    path: 'search-ngmodel',
    loadComponent: () =>
      import('./09-search-ngmodel/search-ngmodel.component').then((m) => m.SearchNgModelComponent),
  },
  {
    path: 'search-reactive',
    loadComponent: () =>
      import('./10-search-reactive/search-reactive.component').then(
        (m) => m.SearchReactiveComponent,
      ),
  },
];
