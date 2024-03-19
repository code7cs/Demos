import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from '@ngrx/store';
import { type } from "os";
import { Observable } from 'rxjs';
import { ITodo } from './todos/interfaces';
import { TodosService } from "./todos/services/todos.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  todoList$: Observable<ITodo[]>;
  filterMode = "All";
  constructor(private _todosService: TodosService, private store: Store<{todos: ITodo[]}>) {
    this.todoList$ = store.select('todos');
  }
  addMyTodo(event) {
    event.preventDefault();
    this._todosService.addTodo(event.target.value);
    event.target.value = "";
  }
  showAll() {
    this.filterMode = "All";
    this._todosService.changeFilterMode("All");
  }
  showActive() {
    this.filterMode = "Active";
    this._todosService.changeFilterMode("Active");
  }
  showCompleted() {
    this.filterMode = "Completed";
    this._todosService.changeFilterMode("Completed");
  }
  clearCompleted() {
    this._todosService.clearCompleted();
  }
}
