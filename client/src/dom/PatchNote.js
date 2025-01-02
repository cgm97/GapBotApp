import React from "react";
import '../css/PatchNote.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const PatchNote = () => {
  const patchNote = JSON.parse(sessionStorage.getItem("patchNote"));

  return (
    <div className="container-patch">
      <h2>빈틈봇 패치노트</h2>
      {patchNote.map(({ TITLE, CONTENTS }) => (
        <div className="release">
          <h3>{TITLE}</h3>
          <ul>
            {CONTENTS}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatchNote;
