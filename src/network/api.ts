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


async function getTodoList(jwt: string) { // 할일 목록 불러오기
    const request = await mainApi({
        url: "/todos",
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })

    return request.data;
}

async function postCreateTodo(jwt: string, todo: string) {
    const request = await mainApi({
        url: "/todos",
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        method: "POST",
        data: {
            todo
        }
    });

    return request.data;
}

export {
    postSignUp,
    postSignIn,
    getTodoList,
    postCreateTodo
}