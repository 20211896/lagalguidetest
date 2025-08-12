import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { IoDocumentTextOutline, IoBookOutline, IoRefreshOutline } from "react-icons/io5";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import axios from "axios";
import BottomNav from "../../lib/nav/BottomNav";
import "./information.css";

const Information = () => {
    const navigate = useNavigate();
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const url = "https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app";

    const goHome = () => {
        navigate("/home");
    };

    const fetchRandomLaws = async () => {
        try {
            setLoading(true);
            setError("");
            
            const token = localStorage.getItem("token");
            const lawIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const randomLaws = [];

            const shuffled = lawIds.sort(() => 0.5 - Math.random());
            const selectedIds = shuffled.slice(0, 3);

            console.log("선택된 랜덤 법률 IDs:", selectedIds);

            for (const lawId of selectedIds) {
                try {
                    const response = await axios.get(`${url}/api/lawinfo/${lawId}`, {
                        headers: token ? {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        } : {}
                    });

                    if (response.data) {
                        randomLaws.push(response.data);
                    }
                } catch (lawError) {
                    console.log(`법률 ID ${lawId} 조회 실패:`, lawError.message);
                }
            }

            if (randomLaws.length > 0) {
                setLaws(randomLaws);
                localStorage.setItem("allLaws", JSON.stringify(randomLaws));
                console.log("가져온 랜덤 법률:", randomLaws);
            } else {
                setError("법률 정보를 가져올 수 없습니다.");
                loadFromLocalStorage();
            }

        } catch (error) {
            console.error("랜덤 법률 조회 실패:", error);
            setError("서버에서 데이터를 가져오는데 실패했습니다.");
            loadFromLocalStorage();
        } finally {
            setLoading(false);
        }
    };

    const loadFromLocalStorage = () => {
        const storedLaws = JSON.parse(localStorage.getItem("allLaws") || "[]");
        console.log("localStorage에서 가져온 데이터:", storedLaws);
        
        if (storedLaws.length > 0) {
            setLaws(storedLaws.slice(0, 3));
        } else {
            setLaws([]);
        }
    };

    const handleDelete = (id) => {
        const updated = laws.filter(law => law.lawInfoId !== id);
        setLaws(updated);
        localStorage.setItem("allLaws", JSON.stringify(updated));
    };

    const handleRefresh = () => {
        fetchRandomLaws();
    };

    useEffect(() => {
        fetchRandomLaws();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>법률 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>법률 정보</p>
            </header>

            <main className="informPage">
                <p className="main_title">근로자 관련 주요 법률정보를 확인하세요</p>
                
                {error && (
                    <div style={{ 
                        padding: '10px', 
                        backgroundColor: '#fff3cd', 
                        border: '1px solid #ffeaa7', 
                        borderRadius: '4px', 
                        marginBottom: '20px',
                        color: '#856404'
                    }}>
                        {error}
                    </div>
                )}

                <div className="row_inform_box">
                    {laws.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            color: '#666'
                        }}>
                            <IoDocumentTextOutline style={{ fontSize: '48px', marginBottom: '16px' }} />
                            <p>법률 정보를 불러올 수 없습니다.</p>
                            <button 
                                onClick={handleRefresh}
                                style={{
                                    marginTop: '16px',
                                    padding: '8px 16px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : (
                        laws.map((law, index) => (
                            <div className="row_inform" key={law.lawInfoId || index}
                                onClick={() =>
                                    navigate("/eachsummary", {
                                        state: {
                                            lawInfoId: law.lawInfoId,
                                            from: "information"
                                        }
                                    })
                                }>
                                <IoDocumentTextOutline className="fileicon" />
                                <div className="row_inform_text">
                                    <p>{law.lawName || "법률명 없음"}</p>
                                    <span>참조 번호: {law.referenceNumber || "N/A"}</span>
                                </div>
                                <TiDeleteOutline
                                    className="delicon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(law.lawInfoId);
                                    }}
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="row_site_box">
                    <div className="row_site_tilte">
                        <IoBookOutline className="icon" />
                        <p>외부 법률 정보 자료</p>
                    </div>
                    <button className="row_site_link" onClick={() => window.open("https://www.moel.go.kr/index.do", "_blank")}>
                        <p>고용노동부</p>
                        <HiArrowTopRightOnSquare />
                    </button>
                    <button className="row_site_link" onClick={() => window.open("https://www.law.go.kr/", "_blank")}>
                        <p>국가법령정보센터</p>
                        <HiArrowTopRightOnSquare />
                    </button>
                </div>
            </main>
            <BottomNav />
        </>
    );
};

export default Information;