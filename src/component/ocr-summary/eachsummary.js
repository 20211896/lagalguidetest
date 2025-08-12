import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import axios from "axios";
import "./eachsummary.css";

const Eachsummary = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    // 1) state 에 lawInfoId 가 없다면 localStorage 에서 꺼내오기
    const incomingLawInfoId = state?.lawInfoId;
    const storedLawInfoId = localStorage.getItem("selectedLawInfoId");
    const lawInfoId = incomingLawInfoId || storedLawInfoId;

    const analysis = state?.analysis;
    const result = state?.result;
    const contractId = state?.contractId;

    // 2) 받은 lawInfoId 가 있으면 localStorage에도 저장
    useEffect(() => {
        if (incomingLawInfoId) {
            localStorage.setItem("selectedLawInfoId", incomingLawInfoId);
        }
    }, [incomingLawInfoId]);

    const [lawDetail, setLawDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cameFromInformation = state?.from === "information";

    const goBack = () => {
        if (cameFromInformation) {
            navigate("/information");
        } else {
            navigate("/ocr-summary", {
                state: {
                    analysis,
                    result,
                    contractId
                }
            });
        }
    };

    // 3) lawInfoId 가 준비되면 상세 API 호출
    useEffect(() => {
        const fetchLawDetail = async () => {
            if (!lawInfoId) {
                setError("lawInfoId가 전달되지 않았습니다.");
                return;
            }
            setLoading(true);
            setError(null);

            try {
                const { data } = await axios.get(
                    `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/lawinfo/${lawInfoId}`
                );
                setLawDetail(data);
            } catch (err) {
                console.error("법률 정보 상세 조회 실패:", err);
                setError(
                    `법률 정보 상세 조회 실패: ${err.message} (${err.response?.status ||
                    "알 수 없는 오류"})`
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLawDetail();
    }, [lawInfoId]);

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goBack} />
                <p>{lawDetail?.lawName || "법률 상세 정보"}</p>
            </header>

            <main className="eachsummary">
                <div className="main_top">
                    <span>법률 조항에 대한 상세 정보와 쉬운 설명을 제공합니다.</span>
                </div>

                <div className="main_main">
                    {loading && <p>불러오는 중입니다...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {!loading && !error && lawDetail && (
                        <>
                            <div className="main_box">
                                <div className="main_box_title">
                                    <p>법률명</p>
                                </div>
                                <div className="content">
                                    <span>
                                        {lawDetail.translatedLawName || lawDetail.lawName || "정보 없음"}
                                    </span>
                                </div>
                            </div>

                            <div className="main_box">
                                <div className="main_box_title">
                                    <p>요약 설명</p>
                                </div>
                                <div className="content">
                                    <span>
                                        {lawDetail.translatedSummary || "정보 없음"}
                                    </span>
                                </div>
                            </div>

                            <div className="main_box">
                                <div className="main_box_title">
                                    <p>참조 번호</p>
                                </div>
                                <div className="content">
                                    <span>
                                        {lawDetail.referenceNumber || "정보 없음"}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {lawDetail?.detailUrl && (
                    <a
                        href={`https://www.law.go.kr${lawDetail.detailUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="BlueBtn"
                    >
                        <span>국가법령정보센터에서 보기<HiArrowTopRightOnSquare className="icon" /></span>
                    </a>
                )}

                <div className="add_text">
                    <p>본 분석은 법률 정보 제공 목적으로만 사용되며, 법적 조언이 아닙니다.</p>
                    <p>정확한 법률 상담은 변호사와 상담하시기 바랍니다.</p>
                </div>
            </main>
        </>
    );
};

export default Eachsummary;
