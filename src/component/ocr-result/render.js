import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import BottomNav from "../../lib/nav/BottomNav";
import axios from "axios";
import "./result.css";

const Render = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const resultData = location.state?.result || {};

    const [contractId, setContractId] = useState(null);

    useEffect(() => {
        if (resultData.contractId) {
            setContractId(resultData.contractId);
            console.log("OCR에서 전달받은 contractId:", resultData.contractId);
        } else {
            setContractId(1);
        }
    }, [resultData]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const goOcr = () => navigate("/ocr");
    const goResult = () => navigate("/ocr-result", { state: { result: resultData } });

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedDocs") || "[]");
        const newDoc = {
            id: Date.now(),
            title: resultData.title || "OCR 번역 결과",
            date: new Date().toLocaleDateString(),
            originalImage: resultData.originalImage,
            translatedImage: resultData.translatedImage,
            contractId: contractId
        };
        saved.push(newDoc);
        localStorage.setItem("savedDocs", JSON.stringify(saved));
        navigate("/mydocument");
    };

    const analyzeLegalInfo = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contracts/${contractId}/analyze`
            );

            const newLaws = response.data.laws || [];
            const prevLaws = JSON.parse(localStorage.getItem("allLaws") || "[]");

            const map = new Map();
            [...prevLaws, ...newLaws].forEach(law => {
                map.set(law.referenceNumber, law);
            });

            localStorage.setItem("allLaws", JSON.stringify([...map.values()]));

            navigate("/ocr-summary", { 
                state: { 
                    analysis: response.data, 
                    result: resultData, 
                    contractId 
                } 
            });
        } catch (err) {
            console.error("법률 분석 실패:", err);
            setError(`법률 분석 실패: ${err.message} (${err.response?.status || "알 수 없는 오류"})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goOcr} />
                <p>번역 결과</p>
            </header>

            <main className="resltPage">
                <div className="resultBtn">
                    <button onClick={goResult}>원본</button>
                    <button className="nowPageBtn">번역 결과</button>
                </div>

                <div className="result_main">
                    <p>번역 결과</p>
                    <img
                        src={resultData.translatedImage || "https://mobicom-contest-bucket-2025.s3.ap-northeast-2.amazonaws.com/contracts/translated/02521fe4-2421-4494-b06e-8bf971ddade2_11_translated.jpg"}
                        alt="번역본 이미지"
                        className="resltImg"
                    />
                </div>

                <div className="saveAndShareBtn">
                    <button onClick={handleSave}>
                        <FaRegSave className="icon" /> 저장하기
                    </button>
                    <button>
                        <FiUpload className="icon" />공유하기
                    </button>
                </div>

                <button 
                    className="BlueBtn" 
                    onClick={analyzeLegalInfo} 
                    disabled={loading}
                >
                    {loading ? "분석 중..." : "법률 분석 보기"}
                </button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </main>
            
            <BottomNav />
        </>
    );
};

export default Render;