import React, { useState } from "react";
import '../css/Command.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Command = () => {
  // 각 항목의 카드가 열려 있는지 여부를 상태로 관리
  const [activeCard, setActiveCard] = useState(null);

  const listLoaItems = [
    { id: 1, prefix: ".정보", img: require('../img/cmd/wjdqh.png') },
    { id: 2, prefix: ".장비", img: require("../img/cmd/wkdql.png") },
    { id: 3, prefix: ".장신구", img: require("../img/cmd/wkdtlsrn.png") },
    { id: 4, prefix: ".내실", img: require("../img/cmd/sotlf.png") },
    { id: 5, prefix: ".부캐", img: require("../img/cmd/qnzo.png") },
    { id: 6, prefix: ".보석", img: require("../img/cmd/qhtjr.png") },
    { id: 7, prefix: ".주급", img: require("../img/cmd/wnrmq.png") },
    { id: 8, prefix: ".앜패", img: require("../img/cmd/dkzvo.png") },
    { id: 9, prefix: ".떠상", img: require("../img/cmd/ejtkd.png") },
    { id: 10, prefix: ".분배금", img: require("../img/cmd/qnsqorma.png") },
    { id: 11, prefix: ".모험섬", img: require("../img/cmd/ahgjatja.png") },
    { id: 12, prefix: ".크리스탈", img: require("../img/cmd/zmfltmxkf.png") },
    { id: 13, prefix: ".경매장", img: require("../img/cmd/rudaowkd.png"), description: "1~10겁작멸홍만 지원" },
    { id: 14, prefix: ".거래소", img: require("../img/cmd/rjfoth.png"), description: "각인서만 지원(인기 각인서는 약자 가능 ex:예둔)" },
    { id: 15, prefix: ".시세", img: require("../img/cmd/tkdwnd.png"), description: "상,상상,상중,상하,중,중중,중하,유각,전각,재료,식물,벌목,낚시,고고학,채광,수렵" },
    { id: 16, prefix: ".사사게", img: null , description:".사사게 키워드"}
  ];

  const listUtilItems = [
    { id: 101, prefix: "이모티콘", img: require("../img/cmd/tkdwnd.png"), description: "씨익콩,더줘콩,뿅콩,감사콩,꺼억콩,도망콩,머쓱해요,놀자에요,뭐라구요" },
    { id: 102, prefix: "/로또", img: require("../img/cmd/tkdwnd.png"), description: "1 ~ 4 확정 로또번호 지원" },
    { id: 103, prefix: "채팅레벨", img: null, description: "/레벨, /랭킹, /칭호" },
  ];
  const toggleCard = (id) => {
    setActiveCard(activeCard === id ? null : id); // 카드 토글
  };

  return (
    <div className="cmdContainer">
      <h2>빈틈봇 명령어</h2>
      <div className="prefix-container">
        <div className="prefix-section">
          <h4>로아 prefix (.)</h4>
          <ul>
            {listLoaItems.map(item => (
              <li key={item.id} onClick={() => toggleCard(item.id)}>
                <span className="arrow">{activeCard === item.id ? "▼" : "▶"}</span>
                {item.prefix}
                {activeCard === item.id && (
                <div className="card active"> {/* active 클래스 추가 */}
                    {item.description && <p>{item.description}</p>}
                    {item.img && <img src={item.img} alt={item.prefix} />}
                </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="prefix-section">
          <h4>유틸 prefix (/)</h4>
          <ul>
            {listUtilItems.map(item => (
              <li key={item.id} onClick={() => toggleCard(item.id)}>
                <span className="arrow">{activeCard === item.id ? "▼" : "▶"}</span>
                {item.prefix}
                {activeCard === item.id && (
                <div className="card active"> {/* active 클래스 추가 */}
                    {item.description && <p>{item.description}</p>}
                    {item.img && <img src={item.img} alt={item.prefix} />}
                </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Command;
