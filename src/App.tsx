import React, {useEffect} from 'react';
import './App.css';
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem("wanted-access-token");

        if(jwt) {
            navigate("/todo");
        }else {
            navigate("/signin");
        }
    }, [navigate])

    return (
        <div className="App">
        </div>
    );
}

export default App;
