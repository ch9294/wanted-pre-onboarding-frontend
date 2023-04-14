import React, {createContext, SetStateAction, useContext, useEffect, useReducer, useRef, useState} from 'react';
import CheckJWT from "../CheckJWT";
import {deleteTodo, getTodoList, postCreateTodo, putUpdateTodo, TodoItem} from "../../network/api";
import {I_TodoState, todoReducer} from "../../reducer/TodoReducer";
import styles from "./TodoList.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

const initState: I_TodoState = {
    list: [],
}

interface I_TodoContext {
    setRefresh?: React.Dispatch<SetStateAction<number>>
}

const TodoContext = createContext<I_TodoContext>({})

function TodoList() {
    const [todoState, dispatch] = useReducer(todoReducer, initState);
    const [refresh, setRefresh] = useState(0);

    const onCreateTodoSubmit = async (todo: string) => {
        try {
            const result = await postCreateTodo(todo);
            console.log("할일 생성 완료", result);
            setRefresh(prev => prev + 1);
        } catch (e) {
            console.log("할일을 생성중에 오류 발생", e);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const result = await getTodoList();
                dispatch({type: "SET_TODO_LIST", list: result});
                console.log("할일 목록", result);
            } catch (e) {
                console.log("할일 목록 조회중에 오류 발생", e);
            }
        })();
    }, [refresh]);

    return (
        <CheckJWT>
            <div className={cx("top-level-container")}>
                <section className={cx("header-container")}>
                    <CreateTodoInput onSubmit={onCreateTodoSubmit}/>
                </section>
                <section className={cx("list-container")}>
                    <TodoContext.Provider value={{setRefresh}}>
                        <TodoListView list={todoState.list}/>
                    </TodoContext.Provider>
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
            <input type="text" value={todo} placeholder="할 일을 입력해주세요..." onChange={handleTodoChange}
                   data-testid="new-todo-input"/>
            <button type="submit" data-testid="new-todo-add-button">추가</button>
        </form>
    )
}

interface I_TodoListView {
    list: TodoItem[];
}

function TodoListView({list}: I_TodoListView) {

    return (
        <ul className={cx("todo-list-view-container")}>
            {
                list.map(item => {
                    const {id} = item;
                    return <TodoItemView item={item} key={`todo-item/${id}`}/>
                })
            }
        </ul>
    )
}

interface I_TodoItemView {
    item: TodoItem
}

function TodoItemView({item}: I_TodoItemView) {
    const {todo, id, isCompleted, userId} = item;
    const [isModify, setIsModify] = useState(false);
    const [isChecked, setIsChecked] = useState(isCompleted);
    const {setRefresh} = useContext(TodoContext);
    const modifyInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = (event: React.MouseEvent) => {
        event.preventDefault();
        const {dataset} = event.target as HTMLButtonElement;

        switch (dataset["testid"]) {
            case "submit-button": {
                (async () => {
                    try {
                        if (modifyInputRef.current) {
                            const {value: modifyVal} = modifyInputRef.current;
                            const res = await putUpdateTodo(modifyVal, isChecked, item.id);

                            setIsModify(false);
                            setRefresh?.(prev => prev + 1);
                        }
                    } catch (e) {
                        console.log("할일 수정 오류 발생", e);
                    }
                })();
                break;
            }
            case "cancel-button": {
                setIsModify(false);
                break;
            }
            case "modify-button": {
                setIsModify(true);
                break;
            }
            case "delete-button": {
                (async () => {
                    try {
                        const res = await deleteTodo(item.id);
                        setRefresh?.(prev => prev + 1);
                    } catch (e) {
                        console.log("할일 삭제 오류 발생", e);
                    }
                })();
                break;
            }
        }
    }

    const handleCompletedChange = (event: React.ChangeEvent) => {
        setIsChecked(prev => {
            (async () => {
                try {
                    const res = await putUpdateTodo(item.todo, !prev, item.id);
                    setRefresh?.(prev => prev + 1);
                } catch (e) {
                    console.log("할일 완료처리 중에 오류 발생", e);
                }
            })();
            return !prev;
        });
    }

    return (
        <li>
            <label htmlFor={`todo-item/${id}`}>
                <input
                    type="checkbox"
                    id={`todo-item/${id}`}
                    checked={isChecked}
                    onChange={handleCompletedChange}/>
                {!isModify && <span>{todo}</span>}
            </label>

            {isModify && <input type="text" data-testid="modify-input" ref={modifyInputRef}/>}
            <span className={cx("todo-item-button-container")} onClick={handleButtonClick}>
            {
                isModify ?
                    <>
                        <button data-testid="submit-button">제출</button>
                        <button data-testid="cancel-button">취소</button>
                    </>
                    :
                    <>
                        <button data-testid="modify-button">수정</button>
                        <button data-testid="delete-button">삭제</button>
                    </>
            }
            </span>

        </li>
    )
}

export default TodoList;