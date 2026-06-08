import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NonTable from "./NonTable";
import { columnState, rowState, seatsState } from "./seatsState";
import { useRecoilState } from "recoil";

function SideBar() {
  const [count, setCount] = useRecoilState(numberState);
  const [row, setRow] = useRecoilState(rowState);
  const [column, setColumn] = useRecoilState(columnState);

  // ⭐ 핵심: 이제 이것만 사용
  const [seats] = useRecoilState(seatsState);

  const [inputValue, setInputValue] = useState(String(count));
  const [rowInput, setRowInput] = useState(String(row));
  const [columnInput, setColumnInput] = useState(String(column));

  const [name, setName] = useState("");

  const navigate = useNavigate();

  // ---------------------------
  // 저장
  // ---------------------------
  const handleSave = () => {
    if (!name.trim()) {
      alert("이름을 입력하세요");
      return;
    }

    if (!seats || seats.length === 0) {
      alert("저장할 좌석이 없습니다");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("seatHistory")) || [];

    const newData = {
      id: Date.now(),
      name,
      seats, // ⭐ recoil 그대로 저장
    };

    localStorage.setItem(
      "seatHistory",
      JSON.stringify([...existing, newData])
    );

    navigate("/");
  };

  // ---------------------------
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 사이드바 */}
      <div
        style={{
          width: 260,
          padding: 20,
          background: "#f8f9fb",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h3>설정</h3>

        {/* 이름 */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          style={{ padding: 8 }}
        />

        {/* 인원 */}
        <input
          value={inputValue}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "");
            setInputValue(v);
            setCount(Number(v || 0));
          }}
          placeholder="인원"
          style={{ padding: 8 }}
        />

        {/* 행 */}
        <input
          value={columnInput}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "");
            setColumnInput(v);
            setColumn(Number(v || 0));
          }}
          placeholder="행"
          style={{ padding: 8 }}
        />

        {/* 저장 */}
        <button
          onClick={handleSave}
          style={{
            marginTop: "auto",
            padding: 12,
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          저장하기
        </button>
      </div>

      {/* 메인 */}
      <div style={{ flex: 1 }}>
        <NonTable />
      </div>
    </div>
  );
}

export default SideBar;