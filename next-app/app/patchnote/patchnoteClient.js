'use client';

import React, { useEffect, useState } from "react";
import '@/css/PatchNote.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const PatchNote = () => {
  const [patchNote, setPatchNote] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("patchNote");
    if (data) {
      setPatchNote(JSON.parse(data));
    }
  }, []);

  return (
    <div className="container-patch bg-background text-foreground min-h-screen">
      <h2>빈틈봇 패치노트</h2>
      {patchNote.map(({ TITLE, CONTENTS }, index) => (
        <div className="release dark:bg-gray-600" key={index}>
          <h3 className="dark:text-blue-400">{TITLE}</h3>
          <p className="dark:text-gray-300">
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