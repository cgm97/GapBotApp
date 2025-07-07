'use client';

import { useState } from 'react';
import KakaoAdFit from '@/components/KakaoAdFit';
import AdSense from '@/components/Adsense';

const CommandPage = () => {
  const [activeCard, setActiveCard] = useState(null);

  const listLoaItems = [
    { id: 1, prefix: <>.정보 <span className="text-xs text-blue-500 dark:text-blue-300">(.내정보)</span></>, img: '/img/cmd/wjdqh.png' },
    { id: 3, prefix: <>.장신구 | .악세 <span className="text-xs text-blue-500 dark:text-blue-300">(.내장신구 | .내악세)</span></>, img: '/img/cmd/wkdtlsrn.png' },
    { id: 4, prefix: <>.팔찌 <span className="text-xs text-blue-500 dark:text-blue-300">(.내팔찌)</span></>, img: '/img/cmd/vkfWl.png' },
    { id: 5, prefix: <>.스킬 <span className="text-xs text-blue-500 dark:text-blue-300">(.내스킬)</span></>, img: '/img/cmd/skill.png' },
    { id: 6, prefix: <>.내실 <span className="text-xs text-blue-500 dark:text-blue-300">(.내내실)</span></>, img: '/img/cmd/sotlf.png' },
    { id: 7, prefix: <>.부캐 <span className="text-xs text-blue-500 dark:text-blue-300">(.내부캐)</span></>, img: '/img/cmd/qnzo.png' },
    { id: 8, prefix: <>.원정대 <span className="text-xs text-blue-500 dark:text-blue-300">(.내원정대)</span></>, img: '/img/cmd/dnjswjdeo.png' },
    { id: 9, prefix: <>.보석 <span className="text-xs text-blue-500 dark:text-blue-300">(.내보석)</span></>, img: '/img/cmd/qhtjr.png' },
    { id: 10, prefix: <>.주급 <span className="text-xs text-blue-500 dark:text-blue-300">(.내주급)</span></>, img: '/img/cmd/wnrmq.png' },
    { id: 11, prefix: <>.앜패 <span className="text-xs text-blue-500 dark:text-blue-300">(.내앜패)</span></>, img: '/img/cmd/dkzvo.png' },
    { id: 12, prefix: <>.떠상 <span className="text-xs text-gray-500 dark:text-gray-300">(루페온 등)</span></>, img: '/img/cmd/ejtkd.png' },
    { id: 13, prefix: <>.분배금</>, img: '/img/cmd/qnsqorma.png' },
    { id: 14, prefix: <>.모험섬</>, img: '/img/cmd/ahgjatja.png' },
    { id: 15, prefix: <>.크리스탈</>, img: '/img/cmd/zmfltmxkf.png' },
    { id: 16, prefix: <>.경매장 <span className="text-xs text-gray-500 dark:text-gray-300">(보석)</span></>, img: '/img/cmd/rudaowkd.png', description: '1~10겁작멸홍만 지원' },
    { id: 17, prefix: <>.거래소 <span className="text-xs text-gray-500 dark:text-gray-300">(각인서)</span></>, img: '/img/cmd/rjfoth.png', description: '각인서만 지원(인기 각인서는 약자 가능 ex:예둔)' },
    {
      id: 18,
      prefix: <>.시세 <span className="text-xs text-gray-500 dark:text-gray-300">(.시세 상 유물or고대 1~3)</span></>,
      img: '/img/cmd/tkdwnd.png',
      description: '상,상상,상중,상하,중,중중,중하,유각,전각,재료,채집,벌목,낚시,고고학,채광,수렵,보석',
    },
    { id: 19, prefix: <>.사사게</>, description: '.사사게 키워드' },
    { id: 20, prefix: <>.클골</> },
    { id: 21, prefix: <>.큐브</>, img: '/img/cmd/cube.png', description: 'LOAGAP 사이트와 연동이 되어야합니다.' },
    { id: 21, prefix: <>.로빌</>, img: '/img/cmd/lostbuild.png', description: '로스트빌드 지원 - 데미지 TOP 3 스킬' },
  ];

  const listUtilItems = [
    {
      id: 101,
      prefix: '이모티콘',
      description: '씨익콩,더줘콩,뿅콩,감사콩,꺼억콩,도망콩,머쓱해요,놀자에요,뭐라구요',
    },
    { id: 102, prefix: '/로또', img: '/img/cmd/lotto.png', description: '1 ~ 4 확정 로또번호 지원' },
    { id: 104, prefix: '/재련', description: 'LOAGAP 재련 시뮬 참조' },
    { id: 105, prefix: '/상급재련 | /상재', description: 'LOAGAP 재련 시뮬 참조' },
    { id: 106, prefix: '/재련랭킹', description: 'LOAGAP 재련 순위 참조' }
  ];

  const toggleCard = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-300">빈틈봇 명령어</h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* 로아 prefix (.) */}
        <div className="prefix-section border border-gray-300 rounded-lg p-4 bg-white shadow flex-1 dark:bg-gray-800">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-gray-300">
            로스트아크 명령어
            <span className="text-xs text-blue-500 dark:text-blue-300">(빈틈봇연동: 대표 캐릭터로 바로 조회)</span>
          </h4>
          <ul className="list-none space-y-2">
            {listLoaItems.map((item) => (
              <li key={item.id} onClick={() => toggleCard(item.id)} className="relative cursor-pointer list-none bg-gray-100 shadow rounded-lg border border-gray-300 px-3 py-2 hover:bg-white transition dark:bg-gray-600 dark:hover:bg-gray-400">
                <div className="border border-gray-300 rounded-md bg-gray-100 flex items-center justify-between dark:bg-gray-600">
                  <span className="font-medium dark:text-gray-300">{item.prefix}</span>
                  <span className="text-sm">{activeCard === item.id ? '▼' : '▶'}</span>
                </div>

                {activeCard === item.id && (
                  <div
                    className="absolute left-0 top-[calc(50%+10px)] z-10 
                    bg-blue-100 p-3 rounded-lg shadow-lg 
                    transition-transform transform scale-100
                    w-[50%] sm:w-[170%] md:w-[200%]"
                  >
                    {item.description && (
                      <p className="text-[20px] leading-snug text-gray-800">{item.description}</p>
                    )}
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.prefix}
                        className="w-[50%] max-w-[50px] sm:max-w-[160%] md:max-w-[160%] mx-auto rounded-md mt-2"
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 유틸 prefix (/) */}
        <div className="prefix-section border border-gray-300 rounded-lg p-4 bg-white shadow flex-1 dark:bg-gray-800">
          <h4 className="text-lg font-semibold mb-4 dark:text-gray-300">유틸리티 명령어</h4>
          <ul className="list-none space-y-2">

            {listUtilItems.map((item) => (
              <li key={item.id} onClick={() => toggleCard(item.id)} className="relative cursor-pointer list-none bg-gray-100 shadow rounded-lg border border-gray-300 px-3 py-2 hover:bg-white transition dark:bg-gray-600 dark:hover:bg-gray-400">
                <div className="border border-gray-300 rounded-md bg-gray-100 flex items-center justify-between dark:bg-gray-600">
                  <span className="font-medium dark:text-gray-300">{item.prefix}</span>
                  <span className="text-sm">{activeCard === item.id ? '▼' : '▶'}</span>
                </div>

                {activeCard === item.id && (
                  <div
                    className="absolute left-[calc(-110%+10px)] top-[calc(50%+10px)] z-10 
                    bg-blue-100 p-3 rounded-lg shadow-lg 
                    transition-transform transform scale-100
                    w-[50%] sm:w-[170%] md:w-[200%]"
                  >
                    {item.description && (
                      <p className="text-[20px] leading-snug text-gray-800">{item.description}</p>
                    )}
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.prefix}
                        className="w-[50%] max-w-[50px] sm:max-w-[160%] md:max-w-[160%] mx-auto rounded-md mt-2"
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center">
            {/* <KakaoAdFit unit="DAN-KjllsdstWjrHOWe6" width={250} height={250} disabled={true} /> */}
            <AdSense adSlot="1985041601" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPage;
