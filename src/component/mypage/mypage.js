import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { GoArrowLeft } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import SelectLanguage from "../../lib/selectbox/SelectLanguage";
import SelectNation from "../../lib/selectbox/SelectNation";
import BottomNav from "../../lib/nav/BottomNav";
import "./mypage.css";

const Mypage = () => {
    const navigate = useNavigate();

    const [lang, setLang] = useState("");
    const [nat, setNat] = useState("");
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [workLocation, setWorkLocation] = useState("");
    const [experienceYears, setExperienceYears] = useState(0);
    const [loading, setLoading] = useState(true);

    const mapApiToSelectValue = (apiValue, type) => {
        if (type === 'language') {
            const languageMap = {
                'ch': 'china',
                'korean': 'korean',
                'china': 'china'
            };
            return languageMap[apiValue] || apiValue;
        }
        
        if (type === 'nationality') {
            const nationalityMap = {
                'zh-cn': 'china',
                'ko': 'Korea',
                'Korea': 'Korea',
                'china': 'china'
            };
            return nationalityMap[apiValue] || apiValue;
        }
        
        return apiValue;
    };

    const mapSelectToApiValue = (selectValue, type) => {
        if (type === 'language') {
            const reverseLanguageMap = {
                'china': 'ch',
                'korean': 'korean'
            };
            return reverseLanguageMap[selectValue] || selectValue;
        }
        
        if (type === 'nationality') {
            const reverseNationalityMap = {
                'china': 'zh-cn',
                'Korea': 'ko'
            };
            return reverseNationalityMap[selectValue] || selectValue;
        }
        
        return selectValue;
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const memberId = user.memberId;
        console.log("memberId:", memberId);
        const token = localStorage.getItem("token");

        if (!memberId || !token) {
            alert("로그인 정보가 없습니다.");
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/users/${memberId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                const data = response.data;
                console.log("API Response:", data);
                
                setUsername(data.username || "");
                setNickname(data.nickname || "");
                setPhone(data.phone || "");
                
                const mappedLanguage = mapApiToSelectValue(data.language, 'language');
                const mappedNationality = mapApiToSelectValue(data.nationality, 'nationality');
                
                console.log("Original language:", data.language, "Mapped to:", mappedLanguage);
                console.log("Original nationality:", data.nationality, "Mapped to:", mappedNationality);
                
                setLang(mappedLanguage || "");
                setNat(mappedNationality || "");
                setWorkLocation(data.workLocation || "");
                setExperienceYears(data.experienceYears || 0);
                
            } catch (error) {
                console.error("회원 정보 조회 실패:", error);
                if (error.response?.status === 401) {
                    alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.clear();
                    navigate("/login");
                } else {
                    alert("회원 정보를 불러오지 못했습니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLanguageChange = (e) => {
        setLang(e.target.value);
        console.log("Language changed to:", e.target.value);
    };

    const handleNationalityChange = (e) => {
        setNat(e.target.value);
        console.log("Nationality changed to:", e.target.value);
    };

    const handleSave = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const memberId = user.memberId;
        const token = localStorage.getItem("token");

        try {
            const updateData = {
                workLocation,
                experienceYears: parseInt(experienceYears, 10),
                language: mapSelectToApiValue(lang, 'language'),
                nationality: mapSelectToApiValue(nat, 'nationality')
            };

            console.log("Saving data:", updateData);

            const response = await axios.put(
                `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/users/${memberId}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("정보가 성공적으로 저장되었습니다.");
            console.log("Save response:", response.data);

        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장에 실패했습니다.");
        }
    };

    const goHome = () => navigate("/home");

    const goLogin = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>내 정보 관리</p>
            </header>

            <main className="myPage">
                <h1>개인 정보</h1>
                <div className="main_main">
                    <label>아이디</label>
                    <input className="inputBox" value={username} disabled />

                    <label>이름</label>
                    <input className="inputBox" value={nickname} disabled />

                    <label>연락처</label>
                    <input className="inputBox" value={phone} disabled />

                    <label>국적</label>
                    <SelectNation value={nat} onChange={handleNationalityChange} />

                    <label>사용언어</label>
                    <SelectLanguage value={lang} onChange={handleLanguageChange} />

                    <label>작업 위치</label>
                    <input 
                        className="inputBox" 
                        value={workLocation} 
                        onChange={e => setWorkLocation(e.target.value)} 
                    />

                    <label>경력 (년)</label>
                    <input 
                        className="inputBox" 
                        type="number" 
                        value={experienceYears} 
                        onChange={e => setExperienceYears(e.target.value)} 
                    />
                </div>

                <Link to="/mypagepw" className="pw_link">비밀번호 재설정</Link>

                <div className="main_bottom">
                    <button className="save_btn" onClick={handleSave}>
                        <FaRegSave className="icon" /> 저장하기
                    </button>
                    <button className="logout_btn" onClick={goLogin}>
                        <IoIosLogOut className="icon" /> 로그아웃
                    </button>
                </div>
            </main>
            <BottomNav />
        </>
    );
};

export default Mypage;