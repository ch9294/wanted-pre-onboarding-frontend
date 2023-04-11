import {TodoItem} from "../network/api";

type TodoAction =
    { type: "SET_TODO_LIST", list: TodoItem[] }

export interface I_TodoState {
    list: TodoItem[];
}

export function todoReducer(state: I_TodoState, action: TodoAction) {
    switch (action.type) {
        case "SET_TODO_LIST": {
            const list = action.list;
            return {...state, list};
        }
    }
}