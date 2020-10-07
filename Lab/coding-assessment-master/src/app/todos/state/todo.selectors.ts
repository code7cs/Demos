import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as todosState from './todos.reducer';

export const todosSelector = createFeatureSelector<todosState.ITodosState>('todos');

export const allTodos = createSelector(
  todosSelector,
  todosState.todos,
);

export const ActiveTodos = createSelector(todosSelector, (state) =>
  state.todos.filter((todo) => todo.completed === false)
);

export const completedTodos = createSelector(todosSelector, (state) =>
  state.todos.filter((todo) => todo.completed === true)
);
