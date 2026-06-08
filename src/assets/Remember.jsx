import React, { useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import NonTable from "./NonTable";
import { useState } from "react";

const Remember = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const history = JSON.parse(localStorage.getItem("seatHistory")) || [];

  const selected = history.find(
    (item) => String(item.id) === id
  );

  const [seatPositions, setSeatPositions] = useState(selected?.seats || []);
const [name, setName] = useState(selected?.name || "");
  if (!selected) return <div>데이터 없음</div>;


    // ⭐ 좌석 바뀔 때마다 자동 저장
  useEffect(() => {
    const updatedHistory = history.map((item) => {
      if (String(item.id) === id) {
        return {
          ...item,
          seats: seatPositions,
        };
      }
      return item;
    });

    localStorage.setItem("seatHistory", JSON.stringify(updatedHistory));
  }, [seatPositions]);

  // ✅ 수정 저장
 const handleUpdate = () => {
  try {
    const safeName = (name || "").trim(); // ⭐ 핵심

    if (!safeName) {
      alert("이름을 입력하세요");
      return;
    }

    const updatedHistory = history.map((item) => {
      if (String(item.id) === id) {
        return {
          ...item,
          name: safeName, // ✅ 정제된 값
          seats: seatPositions,
        };
      }
      return item;
    });

    localStorage.setItem("seatHistory", JSON.stringify(updatedHistory));

    navigate("/");
  } catch (error) {
    console.error(error);
    alert("수정 실패");
  }
};

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 👉 사이드바 (수정 버전) */}
      <div style={{ width: 260, padding: 20, borderRight: "1px solid #ddd" }}>
        <h3>수정</h3>
   <div
  style={{
    padding: "12px",
    borderRadius: 10,
    background: "#fff",
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  }}
>
  <input
    type="text"
    value={name}
    placeholder="이름 입력"
    onChange={(e) => setName(e.target.value)}
    style={{
      width: "100%",
      maxWidth: 140,
      border: "none",
      outline: "none",
      fontSize: 16,
      textAlign: "center",
      background: "transparent",
    }}
  />
</div>            
        <button
          onClick={handleUpdate}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          수정하기
        </button>
      </div>

      {/* 👉 기존 데이터로 렌더링 */}
      <div style={{ flex: 1 }}>
        <NonTable
            initialSeats={seatPositions} // ⭐ 이걸로
          onSave={setSeatPositions} // ⭐ 중요
        />
      </div>
    </div>
  );
};

export default Remember;