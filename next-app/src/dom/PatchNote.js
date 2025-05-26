import React from "react";
import '../css/PatchNote.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import { Helmet } from "react-helmet-async";

const PatchNote = () => {
  const patchNote = JSON.parse(sessionStorage.getItem("patchNote"));

  return (
    <div className="container-patch">
      {/* SEO 메타 태그 */}
      <Helmet>
        <title>패치노트 | LOAGAP</title>
        <meta name="description" content={`LOAGAP 패치노트.`} />
        <meta name="keywords" content="빈틈봇, 패치노트" />
        <meta name="robots" content="index, follow" />

        {/* JSON-LD 구조화 데이터 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "빈틈봇, 패치노트",
            "url": window.location.href,
            "description": `빈틈봇 패치노트`,
            "game": {
              "@type": "VideoGame",
              "name": "Lost Ark"
            }
          })}
        </script>
      </Helmet>
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
