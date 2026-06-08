import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import html2canvas from "html2canvas";
import { useRef } from "react";
import {
  lostNumbersState,
  seatsState,
  currentClassState,
  rowState,
  displayModeState,
  studentsState,
} from "./assets/seatsState";

import { Link, useNavigate } from "react-router-dom";
import NonTable from "./assets/NonTable";

export default function SeatPicker() {
  const [lostNumbers, setLostNumbers] =
    useRecoilState(lostNumbersState);


      
const [swapMode, setSwapMode] = useState(false);
const [selectedSeat, setSelectedSeat] = useState(null);


  const [seats, setSeats] =
    useRecoilState(seatsState);

  const [currentClass, setCurrentClass] =
    useRecoilState(currentClassState);

  const [row, setRow] =
    useRecoilState(rowState);

  const [classHistory, setClassHistory] =
    useState([]);

    const [displayMode, setDisplayMode] =
  useRecoilState(displayModeState);

  const navigate = useNavigate();


  const [students, setStudents] =
  useRecoilState(studentsState);
const [lockMode, setLockMode] =
  useState(false);

  const [showModal, setShowModal] =
  useState(false);



  // ---------------------------
  // 클래스 불러오기
  // ---------------------------
useEffect(() => {
  const loadClasses = () => {
    const savedClasses =
      JSON.parse(
        localStorage.getItem("classes")
      ) || [];

    setClassHistory(savedClasses);
  };

  loadClasses();

  window.addEventListener(
    "storage",
    loadClasses
  );

  return () => {
    window.removeEventListener(
      "storage",
      loadClasses
    );
  };
}, []);

  // ---------------------------
  // seats 자동 저장
  // ---------------------------
  useEffect(() => {
    localStorage.setItem(
      "seatsState",
      JSON.stringify(seats)
    );
  }, [seats]);

  // ---------------------------
  // 클래스 선택
  // ---------------------------
 const handleClassLoad = (item) => {
  const latestClass = classHistory.find(
    (cls) => cls.id === item.id
  );

  if (!latestClass) return;

  if (currentClass?.id === item.id) return;

  setCurrentClass(latestClass);

  const students = latestClass.students || [];

  // ✅ 자동 row 계산 (핵심)
  const defaultRow = 9;
  const safeRow =
    latestClass.row && students.length / latestClass.row <= 5
      ? latestClass.row
      : defaultRow;

  setRow(safeRow);

  // seats 복원
  if (latestClass.seats?.length > 0) {
    setSeats(latestClass.seats);
  } else {
    // seats 없으면 자동 재배치
    const newSeats = students.map((student, index) => {
      const col = index % safeRow;
      const rowIndex = Math.floor(index / safeRow);

      return {
        id: index,
        studentId: student.id,
        value: student.name,
        number: index + 1,
        x: col * 160,
        y: rowIndex * 160,
        locked: false,
      };
    });

    setSeats(newSeats);
  }
};
  // ---------------------------
  // 셔플
  // ---------------------------
  const shuffle = (array) => {
    const arr = [...array];

    for (
      let i = arr.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [arr[i], arr[j]] = [
        arr[j],
        arr[i],
      ];
    }

    return arr;
  };

  // ---------------------------
  // 자리 생성
  // row = 한 줄에 들어갈 박스 개수
  // ---------------------------

  console.log(
  seats.map((s) => ({
    value: s.value,
    studentId: s.studentId,
    locked: s.locked,
  }))
);

const assignSeats = () => {

  if (!currentClass) {
    alert("클래스를 선택하세요.");
    return;
  }

  const students =
    currentClass.students || [];

  const shuffled =
    shuffle(students);


      console.log("students", students);
console.log("seats", seats);
  // 이미 좌석이 있으면
  // 위치는 유지하고 학생만 섞기
  if (seats.length > 0) {
  // 잠긴 좌석에 있는 학생 id
  const lockedStudentIds = seats
    .filter((seat) => seat.locked)
    .map((seat) => seat.studentId);

  // 잠기지 않은 학생들만 추출
  const movableStudents = students.filter(
    (student) =>
      !lockedStudentIds.includes(
        student.id
      )
  );

  const shuffledMovable =
    shuffle(movableStudents);

  let movableIndex = 0;

  const updatedSeats =
    seats.map((seat) => {
      // 잠긴 좌석은 그대로 유지
      if (seat.locked) {
        return seat;
      }

      const student =
        shuffledMovable[
          movableIndex++
        ];

      return {
        ...seat,

        studentId:
          student?.id ?? null,

        value:
          student?.name ??
          "(빈자리)",

        number:
          student?.id ?? "",

        deleted:
          student?.deleted ??
          false,
      };
    });

  setSeats(updatedSeats);
  return;
}

  const safeRow =
    row > 0 ? row : 1;

  const GRID_SIZE = 80;

  const newSeats = shuffled.map(
    (student, index) => {
      const col =
        index % safeRow;

      const rowIndex =
        Math.floor(index / safeRow);

      return {
        id: index,

        studentId:
          student.id,

        value:
          student.name,

        number:
          index + 1,

        x:
          col *
          GRID_SIZE *
          2,

        y:
          rowIndex *
          GRID_SIZE *
          2,
            locked: false
      };
    }
  );

  setSeats(newSeats);
};

  // ---------------------------
  // 초기화
  // ---------------------------
const resetSeats = () => {
  if (!currentClass) return;

  const students =
    currentClass.students || [];

  const safeRow =
    row > 0 ? row : 1;

  const GRID_SIZE = 80;

  const resetLayout = students.map(
    (student, index) => {
      const col =
        index % safeRow;

      const rowIndex =
        Math.floor(index / safeRow);

     return {
  id: index,

  studentId: student.id,

  value: student.name,

  number: index + 1,

  x:
    col *
    GRID_SIZE *
    2,

  y:
    rowIndex *
    GRID_SIZE *
    2,
      locked: false
};
    }
  );

  setSeats(resetLayout);

  setLostNumbers([]);
};




  // ---------------------------
  // 클래스 삭제
  // ---------------------------
  const deleteClass = (id) => {
    const updated =
      classHistory.filter(
        (item) => item.id !== id
      );

    setClassHistory(updated);

    localStorage.setItem(
      "classes",
      JSON.stringify(updated)
    );

    if (currentClass?.id === id) {
      setCurrentClass(null);
      setSeats([]);
    }
  };


  const editClass = (item) => {
  // 학생 정보 불러오기
  setStudents(item.students || []);

  // 수정 중인 클래스 저장
  setCurrentClass(item);

  // 클래스 수정 페이지 이동
  navigate("/class");
};


  // ---------------------------
  // 자리 저장
  // ---------------------------
  const saveSeatLayout = () => {
    if (!currentClass) {
      alert(
        "클래스를 먼저 선택하세요."
      );
      return;
    }

const updatedClasses =
  classHistory.map((item) => {
    if (
      item.id === currentClass.id
    ) {
      return {
        ...item,
        seats,
        row,
      };
    }

    return item;
  });

setClassHistory(updatedClasses);

localStorage.setItem(
  "classes",
  JSON.stringify(updatedClasses)
);

// ✅ 최신 클래스 다시 찾기
const updatedClass =
  updatedClasses.find(
    (item) =>
      item.id === currentClass.id
  );

setCurrentClass(updatedClass);

    setClassHistory(updatedClasses);

    localStorage.setItem(
      "classes",
      JSON.stringify(updatedClasses)
    );

    setCurrentClass({
      ...currentClass,
      seats,
      row,
    });

    alert("자리 저장 완료!");
  };
  const toggleLock = (id) => {
  setLayoutSeats((prev) =>
    prev.map((seat) =>
      seat.id === id
        ? {
            ...seat,
            locked: !seat.locked,
          }
        : seat
    )
  );
};

  const handleCapture = async () => {
  if (!captureRef.current) return;

  try {
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "자리배치.png";
    link.click();
  } catch (error) {
    console.error("캡쳐 실패:", error);
  }
};

  return (
<div
  style={{
    display: "flex",
    padding: 20,
    gap: 20,
    background: "#f8fafc",
    minHeight: "100vh",
    boxSizing: "border-box",
  }}
>
  {/* 메인 */}
  <div
  style={{
    flex: 1,
        minWidth: 1480,

    textAlign: "center",
      background: "white",
      borderRadius: 20,
      padding: 20,
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    {/* 상단 버튼 */}
    <div
      style={{
        display: "flex",
        justifyContent:
          "center",

        alignItems: "center",

        gap: 10,

        marginBottom: 20,

        flexWrap: "wrap",
      }}
    >
     <button
  onClick={() =>
    setShowModal(true)
  }
>
  asd
</button>
      <h1
        style={{
          margin: 0,
          marginRight: 10,
          color: "#111827",
        }}
      >
        자리 정하기
      </h1>

      <button
        onClick={assignSeats}
        style={{
          background: "#84cc16",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        자리 정하기
      </button>

      <button
        onClick={saveSeatLayout}
        style={{
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        저장하기
      </button>

      <button
        onClick={resetSeats}
        style={{
          background: "#16a34a",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        초기화
      </button>

      {/* row 입력 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: 20,
          background: "#f3f4f6",
          padding: "10px 14px",
          borderRadius: 12,
        }}
      >
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          기본 한 줄 좌석 수:
        </span>
<input
  type="number"
  min={1}
  max={9}
  value={row}
onChange={(e) => {
  const value = Number(
    e.target.value
  );

  if (isNaN(value)) return;

  if (value < 1 || value > 9)
    return;

  const students =
    currentClass?.students || [];

  const neededRows =
    Math.ceil(
      students.length / value
    );

  const maxRows = 5;

  if (neededRows > maxRows) {
    alert(
      "현재 학생 수로는 배치할 수 없습니다."
    );
    return;
  }

  setRow(value);

  setSeats((prev) =>
    prev.map((seat, index) => {
      const col =
        index % value;

      const rowIndex =
        Math.floor(
          index / value
        );

      return {
        ...seat,
        x: col * 160,
        y:
          rowIndex * 160,
      };
    })
  );
}}
  style={{
    width: 70,
    padding: "8px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  }}
/>
        {/* 표시 모드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginLeft: 10,
          }}
        >
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            표시 :
          </span>

          <button
            onClick={() =>
              setDisplayMode("id")
            }
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",

              background:
                displayMode === "id"
                  ? "#3b82f6"
                  : "#d1d5db",

              color:
                displayMode === "id"
                  ? "white"
                  : "black",

              fontWeight: "bold",

              cursor: "pointer",
            }}
          >
            번호
          </button>

          <button
            onClick={() =>
              setDisplayMode("name")
            }
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",

              background:
                displayMode ===
                "name"
                  ? "#3b82f6"
                  : "#d1d5db",

              color:
                displayMode ===
                "name"
                  ? "white"
                  : "black",

              fontWeight: "bold",

              cursor: "pointer",
            }}
          >
            이름
          </button>
        </div>
      </div>
<button
onClick={() => {
  setLockMode(prev => {
    const next = !prev;
    if (next) setSwapMode(false); // 🔥 교환 끄기
    return next;
  });
}}
  style={{
    width: 130,

    padding: "8px 12px",
    borderRadius: 10,
    border: "none",

    background: lockMode
      ? "#3b82f6"
      : "#d1d5db",

    fontWeight: "bold",

    cursor: "pointer",
  }}
>
  {lockMode
    ? "잠금 모드 종료"
    : "잠금 모드 시작"}
</button>
   <button
 onClick={() => {
  setSwapMode(prev => {
    const next = !prev;
    if (next) setLockMode(false); // 🔥 잠금 끄기
    return next;
  });
}}
  style={{
    width: 130,
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    background: swapMode ? "#f59e0b" : "#d1d5db",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: 10,
  }}
>
  {swapMode ? "교환 모드 종료" : "자리 교환 모드"}
</button>
    </div>
    {/* 자리 배치 */}
    <NonTable  lockMode={lockMode}   selectedSeat={selectedSeat}
  setSelectedSeat={setSelectedSeat}
      swapMode={swapMode}
  setSwapMode={setSwapMode}/>
  </div>

  {/* 사이드바 */}
  <div
    style={{
    width: 280,
      background: "white",
      borderRadius: 20,
      padding: 16,
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.08)",
      height: "fit-content",
    }}
  >
<Link
  to="/class"
  onClick={(e) => {
    const saved =
      JSON.parse(localStorage.getItem("classes")) || [];

    if (saved.length >= 7) {
      e.preventDefault();
      alert("클래스는 최대 7개까지만 만들 수 있습니다.");
      return;
    }

    setCurrentClass(null);
    setStudents([]);
  }}
>
      <div
        style={{
          background: "#3b82f6",
          color: "white",

          padding: 14,

          borderRadius: 14,

          marginBottom: 16,

          textAlign: "center",

          fontWeight: "bold",

          cursor: "pointer",

          boxShadow:
            "0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        + 클래스 추가하기
      </div>
    </Link>

    {/* 클래스 목록 */}
    <div>
      <h3
        style={{
          marginTop: 0,
          marginBottom: 14,
          color: "#111827",
        }}
      >
        클래스 목록
      </h3>

      {classHistory.map((item) => {
        const isSelected =
          currentClass?.id ===
          item.id;

        return (
          <div
            key={item.id}
            onClick={() =>
              handleClassLoad(item)
            }
            style={{
              padding: 14,

              position: "relative",

              backgroundColor:
                isSelected
                  ? "#dbeafe"
                  : "#f9fafb",

              border:
                isSelected
                  ? "2px solid #3b82f6"
                  : "1px solid #e5e7eb",

              borderRadius: 16,

              marginBottom: 12,

              cursor: "pointer",

              transition: "0.2s",

              boxShadow:
                "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            {/* 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                deleteClass(item.id);
              }}
              style={{
                position:
                  "absolute",

                top: 10,
                right: 10,

                width: 28,
                height: 28,

                borderRadius:
                  "50%",

                border: "none",

                background:
                  "#ef4444",

                color: "white",

                fontWeight:
                  "bold",

                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* 수정 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                editClass(item);
              }}
              style={{
                position:
                  "absolute",

                bottom: 10,
                right: 10,

                width: 28,
                height: 28,

                borderRadius:
                  "50%",

                border: "none",

                background:
                  "#2563eb",

                color: "white",

                fontWeight:
                  "bold",

                cursor: "pointer",
              }}
            >
              e
            </button>

            <div
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 8,
                color: "#111827",
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                color: "#4b5563",
                marginBottom: 4,
              }}
            >
              학생 수 :
              {" "}
              {
                item.students
                  ?.length
              }
            </div>

     
          </div>
        );
      })}
    </div>
  </div>
  {showModal && (
  <div
    onClick={() => setShowModal(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 360,
        background: "white",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>모달</h2>

      <p style={{ color: "#555" }}>
        여기 원하는 내용 넣으면 됨
      </p>

      <button
        onClick={() => setShowModal(false)}
        style={{
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          background: "#ef4444",
          color: "white",
          cursor: "pointer",
        }}
      >
        닫기
      </button>
    </div>
  </div>
)}
</div>

  );
}