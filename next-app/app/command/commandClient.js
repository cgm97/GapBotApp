'use client'

import { useState } from "react";
import '@/css/Command.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import KakaoAdFit from "@/components/KakaoAdFit";

const CommandPage = () => {
  // 각 항목의 카드가 열려 있는지 여부를 상태로 관리
  const [activeCard, setActiveCard] = useState(null);
  const listLoaItems = [
    { id: 1, prefix: ".정보", img: '/img/cmd/wjdqh.png'},
    // { id: 2, prefix: ".장비", img: require("../img/cmd/wkdql.png") },
    { id: 3, prefix: ".장신구(악세)", img: "/img/cmd/wkdtlsrn.png" },
    { id: 4, prefix: ".팔찌", img: "/img/cmd/vkfWl.png" },
    { id: 5, prefix: ".스킬", img: "/img/cmd/skill.png" },
    { id: 6, prefix: ".내실", img: "/img/cmd/sotlf.png" },
    { id: 7, prefix: ".부캐", img: "/img/cmd/qnzo.png" },
    { id: 8, prefix: ".원정대", img: "/img/cmd/dnjswjdeo.png"},
    { id: 9, prefix: ".보석", img: "/img/cmd/qhtjr.png" },
    { id: 10, prefix: ".주급", img: "/img/cmd/wnrmq.png" },
    { id: 11, prefix: ".앜패", img: "/img/cmd/dkzvo.png" },
    { id: 12, prefix: ".떠상", img: "/img/cmd/ejtkd.png" },
    { id: 13, prefix: ".분배금", img: "/img/cmd/qnsqorma.png" },
    { id: 14, prefix: ".모험섬", img: "/img/cmd/ahgjatja.png" },
    { id: 15, prefix: ".크리스탈", img: "/img/cmd/zmfltmxkf.png" },
    { id: 16, prefix: ".경매장", img: "/img/cmd/rudaowkd.png", description: "1~10겁작멸홍만 지원" },
    { id: 17, prefix: ".거래소", img: "/img/cmd/rjfoth.png", description: "각인서만 지원(인기 각인서는 약자 가능 ex:예둔)" },
    { id: 18, prefix: ".시세 (.시세 상 유물or고대 1~3)", img: "/img/cmd/tkdwnd.png", description: "상,상상,상중,상하,중,중중,중하,유각,전각,재료,식물,벌목,낚시,고고학,채광,수렵,보석" },
    { id: 19, prefix: ".사사게", img: null, description: ".사사게 키워드" },
    { id: 20, prefix: ".클골", img: null },
    { id: 21, prefix: ".큐브", img: "/img/cmd/cube.png", description: "LOAGAP 사이트와 연동이 되어야합니다." }
  ];

  const listUtilItems = [
    { id: 101, prefix: "이모티콘", img: null, description: "씨익콩,더줘콩,뿅콩,감사콩,꺼억콩,도망콩,머쓱해요,놀자에요,뭐라구요" },
    { id: 102, prefix: "/로또", img: "/img/cmd/lotto.png", description: "1 ~ 4 확정 로또번호 지원" },
    // { id: 103, prefix: "채팅레벨(중지)", img: null, description: "/레벨, /랭킹, /칭호" },
    { id: 104, prefix: "/재련", img: null, description: "/재련, /재련랭킹" }
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
          <div>
            <KakaoAdFit unit="DAN-KjllsdstWjrHOWe6" width={250} height={250} disabled={true} />
            {/* <ins
                className="kakao_ad_area"
                style={{display: 'none'}}
                data-ad-unit="DAN-KjllsdstWjrHOWe6"
                data-ad-width="250"
                data-ad-height="250">
            </ins> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPage;
