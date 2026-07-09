import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoApiService } from '../shared/todo-api.service';
import { Todo } from '../shared/todo.models';

@Component({
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-ngmodel.component.html',
})
export class SearchNgModelComponent {
  private readonly todoApi = inject(TodoApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  todos: Todo[] = [];

  constructor() {
    this.todoApi.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.cdr.markForCheck();
    });
  }

  get filteredTodos(): Todo[] {
    const query = this.searchTerm.trim().toLowerCase();

    if (query.length < 3) {
      return [];
    }

    return this.todos.filter((todo) => todo.title.toLowerCase().includes(query));
  }
}
