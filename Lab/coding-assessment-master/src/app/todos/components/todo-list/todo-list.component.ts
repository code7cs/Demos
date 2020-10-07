import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ITodo } from "@app/todos/interfaces";
import { TodosService } from '@app/todos/services/todos.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: "app-todos-list",
  styleUrls: ["./todo-list.component.scss"],
  templateUrl: "./todo-list.component.html",
})
export class TodosListComponent implements OnInit, OnChanges {
  @Input() myFilterMode: string;
  todoList$: Observable<ITodo[]>;
  edit_index: number = -1;

  constructor(
    private _todosService: TodosService,
    private store: Store<{ todos: ITodo[] }>
  ) {
    this.todoList$ = store.select("todos");
  }
  ngOnInit() {
    this.todoList$ = this._todosService.allTodos$;
  }

  ngOnChanges() {
    if (this.myFilterMode === "All") {
      this.todoList$ = this._todosService.allTodos$;
    } else if (this.myFilterMode === "Active") {
      this.todoList$ = this._todosService.activeTodos$;
    } else if (this.myFilterMode === "Completed") {
      this.todoList$ = this._todosService.completedTodos$;
    }
  }

  removeMyTodo(index: number) {
    this._todosService.removeTodo(index);
  }

  changeComplete(index: number) {
    this._todosService.toggleComplete(index);
  }

  editMyTodo(index: number) {
    this.edit_index = index;
  }

  updateMyTodo(index, event) {
    this._todosService.updateTodo(index, event.target.value);
    this.edit_index = -1;
  }
}
