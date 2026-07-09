import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { TodoApiService } from '../shared/todo-api.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-reactive.component.html',
})
export class SearchReactiveComponent {
  private readonly todoApi = inject(TodoApiService);

  readonly searchControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  readonly todos$ = this.todoApi.getTodos();

  readonly filteredTodos$ = combineLatest([
    this.todos$,
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
  ]).pipe(
    map(([todos, keyword]) => {
      const query = keyword.trim().toLowerCase();

      if (query.length < 3) {
        return [];
      }

      return todos.filter((todo) => todo.title.toLowerCase().includes(query));
    }),
  );
}
