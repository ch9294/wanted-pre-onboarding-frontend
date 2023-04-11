import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import SignIn from "../pages/sign/SignIn";
import SignUp from "../pages/sign/SignUp";
import TodoList from "../pages/todo/TodoList";

export const router = createBrowserRouter([
    {
        path: "/",
        index: true,
        element: <App/>,
    },
    {
        path: "/signin",
        element: <SignIn/>
    },
    {
        path: "/signup",
        element: <SignUp/>
    },
    {
        path: "/todo",
        element: <TodoList/>
    }
]);