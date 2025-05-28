'use client';

import React from "react";
import '@/css/PatchNote.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const PatchNote = () => {
  const patchNote = JSON.parse(sessionStorage.getItem("patchNote"));

  return (
    <div className="container-patch">
      <h2>빈틈봇 패치노트</h2>
      {patchNote.map(({ TITLE, CONTENTS }, index) => (
        <div className="release" key={index}>
          <h3>{TITLE}</h3>
          <p>
            {CONTENTS.split("\n").map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PatchNote;