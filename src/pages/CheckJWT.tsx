import React from 'react';
import {useNavigate} from "react-router-dom";

function CheckJwt(props: React.PropsWithChildren) {
    const jwt = localStorage.getItem("wanted-access-token");
    const navigate = useNavigate();

    if (!jwt) {
        navigate("/signin");
    }

    return (
        <>
            {props.children}
        </>
    );
}

export default CheckJwt;