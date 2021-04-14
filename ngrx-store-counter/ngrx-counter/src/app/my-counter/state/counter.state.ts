export interface CounterState {
    counter: number;
    channelName: string;
}

export const initialState: CounterState = {
    counter: 10,
    channelName: "Peter's Channel",
}