import {userApi, mainApi} from "./axios";

interface SignInResponse {
    access_token: string;
}

export interface TodoItem {
    id: number;
    todo: string;
    isCompleted: boolean;
    userId: number;
}

interface TodoListResponse {
    list: TodoItem[];
}

async function postSignUp(email: string, password: string) { // 회원가입
    const request = await userApi({
        url: "/auth/signup",
        method: "POST",
        data: {email, password}
    });

    return request.data;
}

async function postSignIn(email: string, password: string): Promise<SignInResponse> {
    const request = await userApi({
        url: "/auth/signin",
        method: "POST",
        data: {email, password}
    });
    return request.data;
}


async function getTodoList() { // 할일 목록 불러오기
    const request = await mainApi({
        url: "/todos",
    })

    return request.data;
}

async function postCreateTodo(todo: string) {
    const request = await mainApi({
        url: "/todos",
        method: "POST",
        data: {
            todo
        }
    });

    return request.data;
}

async function putUpdateTodo(todo: string, isCompleted: boolean, id: number) {
    const request = await mainApi({
        url: `/todos/${id}`,
        method: "PUT",
        data: {todo, isCompleted}
    })
    return request.data;
}

async function deleteTodo(id: number) {
    const request = await mainApi({
        url: `/todos/${id}`,
        method: "DELETE",
    })
    return request.data;
}

export {
    postSignUp,
    postSignIn,
    getTodoList,
    postCreateTodo,
    putUpdateTodo,
    deleteTodo
}