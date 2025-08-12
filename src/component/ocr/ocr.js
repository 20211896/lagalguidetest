import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { IoCameraOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import BottomNav from "../../lib/nav/BottomNav";
import axios from "axios";
import "./ocr.css";

const Ocr = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const goHome = () => navigate("/home");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError("파일을 선택해주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 사용자 정보 가져오기
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const memberId = user.memberId || 1;

            // 실제 OCR API 호출 - 계약서 생성 + OCR 처리
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contract/${memberId}/upload-and-translate`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("OCR 응답:", response.data);

            // 실제 서버 응답에서 데이터 추출
            const resultData = {
                originalImage: URL.createObjectURL(file), // 업로드한 원본 이미지
                translatedImage: response.data.translatedImageUrl || "https://mobicom-contest-bucket-2025.s3.ap-northeast-2.amazonaws.com/contracts/translated/02521fe4-2421-4494-b06e-8bf971ddade2_11_translated.jpg",
                title: "근로계약서 OCR 결과",
                fileName: file.name,
                uploadDate: new Date().toISOString(),
                contractId: response.data.contractId, // 서버에서 생성된 실제 contractId
                ...response.data // 서버에서 온 다른 데이터들도 포함
            };

            setLoading(false);
            console.log("생성된 결과 데이터:", resultData);
            navigate("/ocr-result", { state: { result: resultData } });

        } catch (err) {
            console.error("업로드 실패:", err);
            setError(`업로드 실패: ${err.message} (${err.response?.status || "알 수 없는 오류"})`);
            setLoading(false);
        }
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>근로계약서 스캔</p>
            </header>

            <main className="ocrPage">
                <div className="main_main">
                    <div className="main_main_text">
                        <p>근로 계약서를 촬영하거나 파일을 업로드하세요</p>
                        <span>개인정보는 자동으로 필터링됩니다.</span>
                    </div>
                    <div className="main_btm">
                        <label className="cameraBtn">
                            <IoCameraOutline className="icon" />
                            <p>카메라</p>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleUpload}
                                style={{ display: "none" }}
                            />
                        </label>

                        <label className="uploadBtn">
                            <FiUpload className="icon" />
                            <p>업로드</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    {loading && <p>업로드 중입니다...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="main_bottom">
                    <p>촬영된 문서는 개인정보 보호를 위해 자동으로 필터링 됩니다.</p>
                    <p>번역 및 법률 정보 제공 목적으로만 사용됩니다.</p>
                </div>
            </main>

            <footer>
                <BottomNav />
            </footer>
        </>
    );
};

export default Ocr;