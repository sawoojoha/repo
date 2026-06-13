import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import Lang from "../Lang";
import {
  studentsState,
  currentClassState,
} from "./seatsState";

const Class = () => {
  const navigate = useNavigate();
const [addCount, setAddCount] = useState("");
  const [students, setStudents] =
    useRecoilState(studentsState);
const [currentClass, setCurrentClass] =
  useRecoilState(currentClassState);
  // ✅ 학생 수


const lang =
  navigator.language.startsWith("ko")
    ? "ko"
    : "en";

const t = Lang[lang];

useEffect(() => {
  if (currentClass?.students) {
    setAddCount(
      currentClass.students.length
    );

    setStudents(
      currentClass.students
    );
  }
}, [currentClass]);






  // ✅ 이름 변경
  const changeName = (id, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              name: value,
            }
          : student
      )
    );
  };

  // ✅ 학생 삭제
// ✅ 학생 삭제 (빈자리로 변경)
const removeStudent = (id) => {
  setStudents((prev) =>
    prev.map((student) =>
      student.id === id
        ? {
            ...student,
            deleted: !student.deleted,
          }
        : student
    )
  );
};

  // ✅ 저장
 const saveStudents = () => {
  if (students.length === 0) {
alert(t.noStudents);
    return;
  }

  const saved =
    JSON.parse(
      localStorage.getItem("classes")
    ) || [];

  let updated = [];

  // ✅ 수정 모드
// ✅ 수정 모드
if (currentClass) {
  updated = saved.map((item) => {
    if (item.id !== currentClass.id) {
      return item;
    }

    const updatedSeats =
      (item.seats || []).map(
        (seat) => {
          const student =
            students.find(
              (s) =>
                s.id ===
                seat.studentId
            );

          return {
            ...seat,

    value:
  !student ||
  student.deleted
    ? ""
    : student.name
          };
        }
      );

    return {
      ...item,
      students,
      seats: updatedSeats,
    };
  });
}

  // ✅ 새 클래스 생성
  else {
    const newClass = {
      id: Date.now(),
      name: `${t.className} ${saved.length + 1}`,
      students,
    };

    updated = [
      ...saved,
      newClass,
    ];
  }

localStorage.setItem(
  "classes",
  JSON.stringify(updated)
);














// 수정 모드인 경우
// 수정 모드인 경우
if (currentClass) {
  const updatedClass =
    updated.find(
      (item) =>
        item.id === currentClass.id
    );

  setCurrentClass(updatedClass);
}

// 새 클래스 생성인 경우
else {
  setCurrentClass(
    updated[updated.length - 1]
  );

  // 새 클래스 만들기 후에만 초기화
  setStudents([]);
  setAddCount("");
}

navigate("/");
};

return (
  <div
    style={{
      padding: 30,
      maxWidth: 1800,
      margin: "0 auto",
      minHeight: "100vh",
      boxSizing: "border-box",
      background: "#f8fafc",
    }}
  >
    {/* 상단 헤더 */}
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",

        alignItems: "center",

        marginBottom: 24,

        gap: 20,

        flexWrap: "wrap",
      }}
    >
    {/* 제목 + 뒤로가기 */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
  }}
>
  <button
    onClick={() => navigate("/")}
    style={{
      border: "none",
      background: "#e2e8f0",
      color: "#0f172a",
      padding: "10px 16px",
      borderRadius: 12,
      fontWeight: "700",
      fontSize: 14,
      cursor: "pointer",
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.06)",
      transition: "0.2s",
    }}
  >
   {t.back}
  </button>

  <h2
    style={{
      margin: 0,
      fontSize: 34,
      fontWeight: "800",
      color: "#0f172a",
    }}
  >
   {t.createClass}
  </h2>
</div>

      {/* 학생 수 */}
      <div
        style={{
          background: "white",

          padding: "14px 18px",

          borderRadius: 16,

          boxShadow:
            "0 2px 12px rgba(0,0,0,0.05)",

          display: "flex",

          alignItems: "center",

          gap: 12,
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#334155",
            fontSize: 16,
          }}
        >
       {t.studentCount}
        </span>

        <input
          type="number"
          min={0}
          max={35}
          value={addCount}
        onChange={(e) => {
  const inputValue =
    e.target.value;

  // ✅ 빈칸 허용
  if (inputValue === "") {
    setAddCount("");
    setStudents([]);
    return;
  }

  let value = Number(inputValue);

  if (isNaN(value)) {
    value = 0;
  }

  if (value < 0) {
    value = 0;
  }

  if (value > 35) {
    value = 35;
  }

  setAddCount(value);

const updatedStudents =
  Array.from(
    { length: value },
    (_, index) =>
  students[index] || {
  id: index + 1,
  name: "",
  deleted: false,
}
  );

  setStudents(updatedStudents);
}}
          style={{
            width: 90,

            padding:
              "10px 12px",

            borderRadius: 10,

            border:
              "1px solid #cbd5e1",

            fontSize: 16,

            outline: "none",
          }}
        />

        {/* 저장 버튼 */}
        <button
          onClick={saveStudents}
          disabled={
            students.length === 0
          }
          style={{
            border: "none",

            background:
              students.length === 0
                ? "#94a3b8"
                :  "#0ea5e9",

            color: "white",

            padding:
              "12px 18px",

            borderRadius: 12,

            fontSize: 15,

            fontWeight: "800",

            cursor:
              students.length === 0
                ? "not-allowed"
                : "pointer",

            boxShadow:
              "0 4px 14px rgba(34,197,94,0.25)",
          }}
        >
         {t.save}
        </button>
      </div>
    </div>

    {/* 학생 목록 */}
    <div
      style={{
        display: "grid",

        // ✅ 가로 적극 사용
           gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",

        gap: 18,

        width: "100%",
      }}
    >
      {students.map(
        (student, index) => (
<div
  key={student.id}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,

  background:
  student.deleted
    ? "#f1f5f9"
    : "white",

border:
  student.deleted
    ? "1px solid #94a3b8"
    : "1px solid #e2e8f0",

opacity:
  student.deleted
    ? 0.7
    : 1,

    borderRadius: 18,
    padding: "16px 18px",
    minWidth: 0,
    boxSizing: "border-box",



    boxShadow:
      "0 2px 12px rgba(0,0,0,0.04)",
  }}
>
            {/* 번호 */}
            <div
              style={{
                width: 44,
                height: 44,

                borderRadius: 14,

                background:
                  "#3b82f6",

                color: "white",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontWeight: "800",

                fontSize: 16,

                flexShrink: 0,
              }}
            >
        {student.id}
            </div>

            {/* 이름 입력 */}
           <input
  disabled={student.deleted}
              type="text"
            placeholder={t.enterName}
              value={student.name}
              onChange={(e) =>
                changeName(
                  student.id,
                  e.target.value
                )
              }
                maxLength={9}
              style={{
                flex: 1,

                minWidth: 0,

                border:
                  "1px solid #dbe2ea",

                borderRadius: 14,

                padding:
                  "13px 16px",

                fontSize: 16,

                outline: "none",

                background:
                  "#f8fafc",
              }}
            />

            {/* 삭제 */}
<button
  onClick={() =>
    removeStudent(student.id)
  }
  style={{
    border: "none",

    background:
      student.deleted
        ? "#0ea5e9"
        :   "#64748b",

    color: "white",

    borderRadius: 14,

    padding: "12px 16px",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: 14,

    flexShrink: 0,
  }}
>
{student.deleted
  ? t.restore
  : t.delete}
</button>
          </div>
        )
      )}
    </div>
  </div>
);
}
export default Class;