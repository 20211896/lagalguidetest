import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import SelectLanguage from "../../lib/selectbox/SelectLanguage";
import SelectNation from "../../lib/selectbox/SelectNation";
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";
import "./signup.css";

const Setmyinform = () => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNum: "",
        nationality: "",
        language: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const goNext = () => {
        console.log(formData);
        navigate("/signup", { state: formData });
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={() => navigate("/")} />
            </header>

            <main className="signPage">
                <div className="main_top">
                    <div className="logo">
                        <img src={logoImg} className="logoImg" alt="logo" />
                        <img src={logoText} className="logoText" alt="text" />
                    </div>
                    <h1>회원가입</h1>
                    <p>계정을 만들어 서비스를 이용하세요</p>
                </div>

                <div className="main_main">
                    <div className="form_row">
                        <label>국적</label>
                        <SelectNation value={formData.nationality} onChange={handleSelectChange('nationality')} />
                        <label>사용 언어</label>
                        <SelectLanguage value={formData.language} onChange={handleSelectChange('language')} />
                        <label>이름</label>
                        <input className="inputBox" name="name" placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} />
                        <label>연락처</label>
                        <input className="inputBox" name="phoneNum" placeholder="연락처를 입력하세요" value={formData.phoneNum} onChange={handleChange} />
                    </div>
                </div>

                <div className="main_bottom">
                    <button onClick={goNext} className="BlueBtn">다음</button>
                    <div className="main_main_signUp">
                        <span>이미 계정이 있으신가요?</span>
                        <Link to="/login">로그인</Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Setmyinform;