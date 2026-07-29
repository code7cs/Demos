import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { TodoApiService } from '../shared/todo-api.service';
import { Todo } from '../shared/todo.models';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-input-event.component.html',
})
export class SearchInputEventComponent {
  private readonly todoApi = inject(TodoApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];

  constructor() {
    this.todoApi.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.filteredTodos = todos;
      this.cdr.markForCheck();
    });
  }

  onSearch(keyword: string): void {
    const query = keyword.trim().toLowerCase();
    this.filteredTodos = this.todos.filter((todo) => todo.title.toLowerCase().includes(query));
  }
}
