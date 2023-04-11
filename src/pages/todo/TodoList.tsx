import React, {useEffect, useReducer, useState} from 'react';
import CheckJWT from "../CheckJWT";
import {getTodoList, postCreateTodo, TodoItem} from "../../network/api";
import {I_TodoState, todoReducer} from "../../reducer/TodoReducer";
import styles from "./TodoList.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

const initState: I_TodoState = {
    list: [],
}

function TodoList() {
    const [todoState, dispatch] = useReducer(todoReducer, initState);
    const [refresh, setRefresh] = useState(0);
    const jwt = localStorage.getItem("wanted-access-token");

    const onCreateTodoSubmit = async (todo: string) => {
        try {
            if (jwt) {
                const result = await postCreateTodo(jwt, todo);
                console.log("할일 생성 완료", result);
                setRefresh(prev => prev + 1);
            }
        } catch (e) {
            console.log("할일을 생성중에 오류 발생", e);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                if (jwt) {
                    const result = await getTodoList(jwt);
                    dispatch({type: "SET_TODO_LIST", list: result});
                    console.log("할일 목록", result);
                }
            } catch (e) {
                console.log("할일 목록 조회중에 오류 발생", e);
            }
        })();
    }, [jwt, refresh]);

    return (
        <CheckJWT>
            <div className={cx("top-level-container")}>
                <section className={cx("header-container")}>
                    <CreateTodoInput onSubmit={onCreateTodoSubmit}/>
                </section>
                <section className={cx("list-container")}>
                    <TodoListView list={todoState.list}/>
                </section>
            </div>
        </CheckJWT>
    );
}

interface I_CreateTodoInput {
    onSubmit: (todo: string) => void;
}

function CreateTodoInput({onSubmit}: I_CreateTodoInput) {
    const [todo, setTodo] = useState("");
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(todo);
    };

    const handleTodoChange = (event: React.ChangeEvent) => {
        const {value} = event.target as HTMLInputElement;
        setTodo(value);
    };

    return (
        <form className={cx("todo-input-container")} onSubmit={handleSubmit}>
            <input type="text" value={todo} placeholder="할 일을 입력해주세요..." onChange={handleTodoChange}/>
            <button type="submit">추가</button>
        </form>
    )
}

interface I_TodoListView {
    list: TodoItem[];
}

function TodoListView({list}: I_TodoListView) {

    return (
        <article className={cx("todo-list-view-container")}>
            {
                list.map(item => {
                    const {id} = item;
                    return <TodoItemView item={item} key={`todo-item/${id}`}/>
                })
            }
        </article>
    )
}

interface I_TodoItemView {
    item: TodoItem
}

function TodoItemView({item}: I_TodoItemView) {
    const {todo, id, isCompleted, userId} = item;

    return (
        <li>
            <label htmlFor={`todo-item/${id}`}>
                <input type="text" id={`todo-item/${id}`} hidden={true}/>
                <span>{todo}</span>
            </label>
        </li>
    )
}

export default TodoList;