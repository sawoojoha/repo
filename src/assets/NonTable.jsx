import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useRecoilState,
  useRecoilValue,
} from "recoil";

import html2canvas from "html2canvas";

import {
  rowState,
  seatsState,
  currentClassState,
  displayModeState,
} from "./seatsState";

const NonTable = ({lockMode,  
  swapMode,
  setSwapMode,
  selectedSeat,
  setSelectedSeat,}) => {
  // ✅ 칸 크기
  const GRID_SIZE = 80;

  // ✅ 격자 크기
  const COLS = 18;
  const ROWS = 10;

  const captureRef =
    useRef(null);

  const displayMode =
    useRecoilValue(
      displayModeState
    );

  const [row] =
    useRecoilState(rowState);

  const currentClass =
    useRecoilValue(
      currentClassState
    );

  const [layoutSeats, setLayoutSeats] =
    useRecoilState(seatsState);

  // ✅ 드래그 상태
  const [draggingId, setDraggingId] =
    useState(null);

  const [offset, setOffset] =
    useState({
      x: 0,
      y: 0,
    });

  // ✅ 자리 직접 수정 여부
const [hasMovedSeat, setHasMovedSeat] =
  useState(false);








// ✅ 클래스 변경 시 초기화
useEffect(() => {
  setHasMovedSeat(false);
}, [currentClass]);
  // -----------------------------------
  // ✅ row 변경 시 자동 재배치
  // 단, 직접 이동한 경우 제외
  // -----------------------------------
useEffect(() => {
  if (!currentClass) {
    setLayoutSeats([]);
    return;
  }



  if (
    currentClass.seats &&
    currentClass.seats.length > 0
  ) {
    setLayoutSeats(currentClass.seats);
    return;
  }

  const students =
    currentClass.students || [];

  const safeRow =
    row > 0 ? row : 1;

  const newSeats = students.map(
    (student, index) => {
      const col = index % safeRow;
      const rowIndex = Math.floor(
        index / safeRow
      );

      return {
        id: index,
        studentId: student.id,
        value: student.name,
        number: index + 1,
        x: col * GRID_SIZE * 2,
        y:
          rowIndex *
          GRID_SIZE *
          2,
        locked: false,
      };
    }
  );

  setLayoutSeats(newSeats);

}, [currentClass]);

  // -----------------------------------
  // ✅ 드래그 시작
  // -----------------------------------
  const handleMouseDown = (
    e,
    id
  ) => {
    e.preventDefault();

    const seat =
      layoutSeats.find(
        (s) => s.id === id
      );

    if (!seat) return;

    setDraggingId(id);

    setOffset({
      x:
        e.clientX - seat.x,
      y:
        e.clientY - seat.y,
    });
  };

  // -----------------------------------
  // ✅ 드래그 중
  // -----------------------------------
  const handleMouseMove = (
    e
  ) => {
    if (
      draggingId === null
    )
      return;

    let newX =
      e.clientX -
      offset.x;

    let newY =
      e.clientY -
      offset.y;

    // ✅ 격자 맞춤
    newX =
      Math.round(
        newX /
          GRID_SIZE
      ) * GRID_SIZE;

    newY =
      Math.round(
        newY /
          GRID_SIZE
      ) * GRID_SIZE;

    // ✅ 최소 제한
    newX = Math.max(
      0,
      newX
    );

    newY = Math.max(
      0,
      newY
    );

    // ✅ 최대 제한
    newX = Math.min(
      newX,
      GRID_SIZE *
        (COLS - 1)
    );

    newY = Math.min(
      newY,
      GRID_SIZE *
        (ROWS - 1)
    );

    setLayoutSeats((prev) =>
      prev.map((seat) => {
        if (
          seat.id ===
          draggingId
        ) {
          // ✅ 위치 바뀌면
          // 자동 재배치 중단
          if (
            seat.x !== newX ||
            seat.y !== newY
          ) {
            setHasMovedSeat(
              true
            );
          }

          return {
            ...seat,
            x: newX,
            y: newY,
          };
        }

        return seat;
      })
    );
  };

  // -----------------------------------
  // ✅ 드래그 종료
  // -----------------------------------
  const handleMouseUp =
    () => {
      setDraggingId(null);
    };

  // -----------------------------------
  // ✅ 겹침 검사
  // -----------------------------------
  const overlapMap = {};

  layoutSeats.forEach(
    (seat) => {
      const key =
        `${seat.x}-${seat.y}`;

      overlapMap[key] =
        (overlapMap[
          key
        ] || 0) + 1;
    }
  );

  // -----------------------------------
  // ✅ 캡쳐
  // -----------------------------------
  const handleCapture =
    async () => {
      if (
        !captureRef.current
      )
        return;

      try {
        const canvas =
          await html2canvas(
            captureRef.current,
            {
              backgroundColor:
                "#ffffff",
              scale: 2,
            }
          );

        const image =
          canvas.toDataURL(
            "image/png"
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = image;

        link.download =
          "자리배치.png";

        link.click();

      } catch (error) {
        console.error(
          "캡쳐 실패:",
          error
        );
      }
    };









   const handleSwap = (seat) => {
  if (!swapMode) return;

  // 1번째 선택
  if (!selectedSeat) {
    setSelectedSeat(seat);
    return;
  }

  // 같은 좌석이면 초기화
  if (selectedSeat.id === seat.id) {
    setSelectedSeat(null);
    return;
  }

  setLayoutSeats(prev =>
    prev.map(s => {
      if (s.id === selectedSeat.id) {
        return { ...s, x: seat.x, y: seat.y };
      }
      if (s.id === seat.id) {
        return { ...s, x: selectedSeat.x, y: selectedSeat.y };
      }
      return s;
    })
  );

  setSelectedSeat(null);
};




  return (
    <>
      {/* 캡쳐 버튼 */}
      <button
        onClick={
          handleCapture
        }
        style={{
          position:
            "fixed",

          right: 20,
          bottom: 20,

          zIndex: 999,

          background:
            "#2563eb",

          color: "white",

          border: "none",

          borderRadius: 12,

          padding:
            "12px 18px",

          fontWeight:
            "bold",

          cursor: "pointer",

          boxShadow:
            "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        캡쳐(미완)
      </button>

      {/* 전체 영역 */}
      <div
        onMouseMove={
          handleMouseMove
        }
        onMouseUp={
          handleMouseUp
        }
        style={{
             width: 1440,
    minWidth: 1440,

          height:
            "calc(100vh - 140px)",

          position:
            "relative",

          overflow:
            "hidden",

          userSelect:
            "none",
        }}
      >
        {/* 격자 */}
        <div
          ref={captureRef}
          style={{
            position:
              "relative",

            width:
              GRID_SIZE *
              COLS,

            height:
              GRID_SIZE *
              ROWS,

            margin:
              "0 auto",

            background:
              "white",
                  width: 1440,
    height: 800,
          }}
        >
          {/* 실제 격자 */}
          {Array.from({
            length: ROWS,
          }).map(
            (
              _,
              rowIndex
            ) =>
              Array.from({
                length:
                  COLS,
              }).map(
                (
                  _,
                  colIndex
                ) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      position:
                        "absolute",

                      left:
                        colIndex *
                        GRID_SIZE,

                      top:
                        rowIndex *
                        GRID_SIZE,

                      width:
                        GRID_SIZE,

                      height:
                        GRID_SIZE,

                      border:
                        "1px solid #ddd",

                      boxSizing:
                        "border-box",

                      pointerEvents:
                        "none",
                    }}
                  />
                )
              )
          )}

          {/* 좌석 */}
          {layoutSeats.map(
            (seat) => {
              const key =
                `${seat.x}-${seat.y}`;
  const isSelected = selectedSeat?.id === seat.id; // 👈 여기!
              const overlap =
                overlapMap[
                  key
                ];

              let bg =
                "#f5f5f5";


                if (seat.locked) {
  bg = "#ece9e9";
}


if (selectedSeat?.id === seat.id) {
  bg = "#60a5fa"; // 선택 강조색
}
              if (
                overlap === 2
              ) {
                bg =
                  "yellow";
              }

              if (
                overlap >= 3
              ) {
                bg = "red";
              }

              return (
                 <div
    key={seat.id}
    onMouseDown={(e) =>
      handleMouseDown(e, seat.id)
    }
  onClick={() => {
  if (lockMode) {
    setLayoutSeats(prev =>
      prev.map(s =>
        s.id === seat.id
          ? { ...s, locked: !s.locked }
          : s
      )
    );
    return;
  }

  if (swapMode) {
    if (!selectedSeat) {
      setSelectedSeat(seat);
      return;
    }

    if (selectedSeat.id === seat.id) {
      setSelectedSeat(null);
      return;
    }

    setLayoutSeats(prev => {
      const a = prev.find(s => s.id === selectedSeat.id);
      const b = prev.find(s => s.id === seat.id);

      return prev.map(s => {
        if (s.id === a.id) return { ...a, x: b.x, y: b.y };
        if (s.id === b.id) return { ...b, x: a.x, y: a.y };
        return s;
      });
    });

    setSelectedSeat(null);
    return;
  }
}}
style={{
  position: "absolute",

  left: seat.x + 1,
  top: seat.y + 1,

  width: GRID_SIZE - 2,
  height: GRID_SIZE - 2,

  background: bg,

  cursor:
    draggingId === seat.id
      ? "grabbing"
      : "grab",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: 13,
  fontWeight: "bold",

  boxSizing: "border-box",

  border:
    draggingId === seat.id
      ? "1px solid black"
      : "none",

  zIndex:
    draggingId === seat.id
      ? 100
      : 1,
}}
                >
              {!seat.deleted &&
  (displayMode === "name"
    ? seat.value
    : seat.number)}
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default NonTable;