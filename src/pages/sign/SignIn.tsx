import React, {useState} from 'react';
import styles from "./SignIn.module.scss";
import cn from "classnames/bind";
import {Link, useNavigate} from "react-router-dom";
import {postSignIn} from "../../network/api";

const cx = cn.bind(styles);

function SignIn() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isEmailCheck, setEmailCheck] = useState(false);
    const [isPasswordCheck, setPasswordCheck] = useState(false);
    const navigate = useNavigate();

    const onEmailChange = (value: string, isCheck: boolean) => {
        setEmail(value);
        setEmailCheck(isCheck);
    }

    const onPasswordChange = (value: string, isCheck: boolean) => {
        setPassword(value);
        setPasswordCheck(isCheck);
    }

    const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const {access_token} = await postSignIn(email, password);
            localStorage.setItem("wanted-access-token", access_token);
            navigate("/todo");
        } catch (e) {
            console.log("로그인에 실패하였습니다", e);
            alert("로그인에 실패하였습니다");
        }
    }

    return (
        <div className={cx("top-level-container")}>
            <form className={cx("sign-in-container")}
                  onSubmit={onFormSubmit}>
                <h2>로그인</h2>
                <SignInput
                    inputType="email"
                    id="email-input"
                    labelText="이메일"
                    placeholderText="이메일을 입력해주세요"
                    onChange={onEmailChange}/>
                <SignInput
                    inputType="password"
                    id="password-input"
                    labelText="비밀번호"
                    placeholderText="비밀번호를 입력해주세요"
                    onChange={onPasswordChange}/>
                <button
                    disabled={!isEmailCheck || !isPasswordCheck}
                    data-testid="signin-button"
                    className={cx("sign-in-button")}
                    type="submit">로그인
                </button>

                <Link to="/signup" className={cx("sign-up-button")}>아직 회원이 아니신가요?</Link>
            </form>
        </div>
    );
}

interface I_SignInput {
    inputType: React.HTMLInputTypeAttribute | undefined;
    id: string;
    labelText: string;
    placeholderText: string;
    onChange: (value: string, bool: boolean) => void;
}

export function SignInput({inputType, id, labelText, placeholderText, onChange}: I_SignInput) {
    const [value, setValue] = useState("");
    const [isValidate, setIsValidate] = useState(true);

    const checkValidation = (value: string) => {
        if (inputType === "email") {
            if (value.includes("@")) {
                setIsValidate(prev => {
                    onChange(value, true);
                    return true;
                });
            } else {
                setIsValidate(prev => {
                    onChange(value, false);
                    return false;
                });
            }
        } else if (inputType === "password") {
            if (value.length >= 8) {
                setIsValidate(prev => {
                    onChange(value, true);
                    return true;
                });
            } else {
                setIsValidate(prev => {
                    onChange(value, false);
                    return false;
                });
            }
        }
    };

    const handleChange = (event: React.ChangeEvent) => {
        const {value} = event.target as HTMLInputElement;
        setValue(value);
        checkValidation(value);
    };


    return <div className={cx("sign-in-input-container")}>
        <label htmlFor={id}>{labelText}</label>
        <input type={inputType}
               id={id}
               value={value}
               data-testid={id}
               onChange={handleChange}
               className={cx({"invalidate": !isValidate})}
               placeholder={placeholderText}/>
    </div>
}

export default SignIn;