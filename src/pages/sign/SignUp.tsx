import React, {useState} from 'react';
import styles from "./SignUp.module.scss";
import cn from "classnames/bind";
import {SignInput} from "./SignIn";
import {postSignUp} from "../../network/api";
import {useNavigate} from "react-router-dom";

const cx = cn.bind(styles);

function SignUp() {
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
            const result = await postSignUp(email, password);
            alert("회원가입이 완료되었습니다");

            setTimeout(() => {
                navigate("/signin");
            }, 1500);

        } catch (e) {
            console.log("회원가입 오류 발생", e);
            alert("회원가입에 실패하였습니다");
        }
    }

    return (
        <div className={cx("top-level-container")}>
            <form className={cx("sign-up-container")}
                  onSubmit={onFormSubmit}>
                <h2>회원가입</h2>
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
                    data-testid="signup-button"
                    className={cx("sign-up-button")}
                    type="submit">회원가입
                </button>
            </form>
        </div>
    );
}

export default SignUp;