import { createAction, props } from "@ngrx/store";

export const increment = createAction('INCREMENT');
export const decrement = createAction('DECREMENT');
export const reset = createAction('RESET');

export const customIncrement = createAction('CUSTOMINCREMENT', props<{ count: number }>());

export const changeChannelName = createAction('CHANGECHANNELNAME');