import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

import { FILTER_MODES } from './../constants/filter-modes';
import { ITodo } from '../interfaces/ITodo';
import { by } from 'protractor';

export interface ITodosState {
  filterMode?: FILTER_MODES;
  todos?: ITodo[];
}

export const initialState: ITodosState = {
  filterMode: "All",
  todos: [
    { text: "Go to Market", completed: false },
    { text: "Go to restaurant", completed: true },
  ],
};

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,

    on(TodoActions.addTodo, (existingState, { text }) => ({
      ...existingState,
      todos: [{ text, completed: false }, ...existingState.todos],
    })),

    on(TodoActions.removeTodo, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos.splice(index, 1);
      return {
        ...existingState,
        todos: updatedTodos,
      };
    }),

    on(TodoActions.changeFilterMode, (existingState, { mode }) => ({
      ...existingState,
      filterMode: mode,
    })),

    on(TodoActions.clearCompleted, (existingState) => ({
      ...existingState,
      todos: [...existingState.todos.filter((todo) => !todo.completed)],
    })),

    on(TodoActions.toggleCompleted, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos[index] = {
        ...updatedTodos[index],
        completed: !updatedTodos[index].completed,
      };
      return {
        ...existingState,
        todos: updatedTodos,
      };
    }),

    on(TodoActions.toggleAllCompleted, (existingState, {}) => {
      const updatedTodos = [...existingState.todos];
      return {
        ...existingState,
        todos: updatedTodos.map((todo) => ({
            ...todo,
            completed: !updatedTodos[0].completed,
          }))
      };
    }),
    
    on(TodoActions.updateTodo, (existingState, { index, text }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos[index] = {
        ...updatedTodos[index],
        text: text
      };
      return {
        ...existingState,
        todos: updatedTodos,
      };
    })
  )(state, action);
}

// export function filterModeReducer(state: ITodosState, action: Action) {
//   return createReducer(
//     initialState,
//     on(TodoActions.changeFilterMode, (existingState, {mode}) => {
//       const updatedTodos = [...existingState.todos];
//       if (mode === "All") {
//         return {...existingState, todos: updatedTodos}
//       } else if (mode === "Active") {
//         return {...existingState, todos: updatedTodos.filter(todo=>todo.)}
//       }
//     })
//   )
// }

export const filterMode = (state: ITodosState) => state.filterMode;
export const todos = (state: ITodosState) => state.todos;
