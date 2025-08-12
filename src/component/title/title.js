import React, { useState } from "react";     
import SelectLanguage from "../../lib/selectbox/SelectLanguage";
import { useNavigate } from 'react-router-dom';
import "./title.css";
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";

const Title = () => {
    const [lang, setLang] = useState("");
    const navigate = useNavigate();
    
    const goToLogin = () => {
        navigate('/login');
    }
    
    const goToSignup = () => {
        navigate('/setmyinform');
    }

    const handleLanguageChange = (e) => {
        setLang(e.target.value);
    }

    return (
        <>
            <main className="titlePage">
                <div className="logo">
                    <img src={logoImg} className="logoImg" alt="logo"/>
                    <img src={logoText} className="logoText" alt="text"/>
                </div>

                <h1>외국인 근로자를 위한 법률 가이드</h1>
                <p>근로계약서 번역 및 법률 정보 제공 서비스</p>

                <SelectLanguage
                    value={lang}
                    onChange={handleLanguageChange}
                />

                <div className="main_main_btn">
                    <button onClick={goToLogin} className="loginBtn">로그인</button>
                    <button onClick={goToSignup} className="signBtn">회원가입</button>
                </div>
                <span>회원가입 시 이용약관과 개인정보처리방침에 동의하게 됩니다.</span>
            </main>
        </>
    )
}

export default Title