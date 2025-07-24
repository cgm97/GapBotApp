'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const PACKAGE_TYPES = [
  { label: '주간', value: '01' },
  { label: '월간', value: '02' },
  { label: '한정', value: '03' },
];

function PackageCalc({ packageDvcd, marketsPrice, crystalPrice, jewelsPrice, selectedPackageData }) {
  const [packageType, setPackageType] = useState('');
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [packageCount, setPackageCount] = useState('');
  const [dicoPrice, setDicoPrice] = useState('');
  const [items, setItems] = useState([]);
  const [result, setResult] = useState(null);
  const [allItemList, setAllItemList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nowCrystalPrice, setNowCrystalPrice] = useState(0);
  const [giftSale, setGiftSale] = useState('');

  // 계산 결과용 상태
  const [packageBuyPrice, setPackageBuyPrice] = useState(0);
  const [packageBuyGold, setPackageBuyGold] = useState(0);
  const [itemsGold, setItemGold] = useState(0);
  const [differencePrice, setDifferencePrice] = useState(0);
  const [efficiency, setEfficiency] = useState(0);

  const [differenceDicoPrice, setDifferenceDicoPrice] = useState(0);
  const [efficiencyDico, setEfficiencyDico] = useState(0);
  const [goldDico, setgoldDico] = useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!marketsPrice) return;
    const crystalPrice_1 = crystalPrice[crystalPrice.length - 1].close / 100; // 1 블루크리스탈 골드 가격
    setNowCrystalPrice(crystalPrice_1);

    // 큐브 패키지 숨결 + 돌파석 + 보석 기준으로 계산
    const cube_red_price = marketsPrice.강화추가재료.find(item => item.name === '용암의 숨결').price;
    const cube_blue_price = marketsPrice.강화추가재료.find(item => item.name === '빙하의 숨결').price;
    const cube_stone_price = marketsPrice.강화재료.find(item => item.name === '운명의 돌파석').price;
    const filtered = Object.values(jewelsPrice).filter(item => item.name.includes('2레벨'));
    const cube_jewels_price = filtered.reduce((prev, current) => {
      return (prev.price > current.price) ? prev : current;
    }).price;
    const cardExp_book_price = 43 * crystalPrice_1; // 메넬리크의 서(9000) 1188원 = 블루크리스탈 43개
    const cardExp_taecho_price = 22 * crystalPrice_1; // 대초의 조각(3000) 594원 = 블루크리스탈 22개

    const mergedList = [
      ...marketsPrice.강화재료.map(item => ({ ...item, category: '강화재료' })),
      ...marketsPrice.강화추가재료.map(item => ({ ...item, category: '강화추가재료' })),
      { name: "크리스탈", bundleCount: 1, price: crystalPrice_1 },
      { name: "고대의 백금화", bundleCount: 1, price: 200, icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/all_quest/all_quest_03_20.png" },
      // { name: "큐브 입장권(1해금)", bundleCount: 1, price: ((cube_red_price * 4) + (cube_blue_price * 4) + (cube_stone_price * 14) + (cube_jewels_price * 3) + cardExp_book_price + (cardExp_taecho_price * 1.67)).toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_193.png" },
      // { name: "큐브 입장권(2해금)", bundleCount: 1, price: ((cube_red_price * 5) + (cube_blue_price * 5) + (cube_stone_price * 25) + (cube_jewels_price * 6) + cardExp_book_price + (cardExp_taecho_price * 1.83)).toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_194.png" },
      // { name: "큐브 입장권(3해금)", bundleCount: 1, price: ((cube_red_price * 6) + (cube_blue_price * 6) + (cube_stone_price * 32) + (cube_jewels_price * 8) + cardExp_book_price + (cardExp_taecho_price * 2)).toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_195.png" },
      { name: "큐브 입장권(1해금)", bundleCount: 1, price: ((cube_red_price * 4) + (cube_blue_price * 4) + (cube_stone_price * 14) + (cube_jewels_price * 3)).toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_193.png" },
      { name: "큐브 입장권(2해금)", bundleCount: 1, price: ((cube_red_price * 5) + (cube_blue_price * 5) + (cube_stone_price * 25) + (cube_jewels_price * 6)).toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_194.png" },
      { name: "큐브 입장권(3해금)", bundleCount: 1, price: ((cube_red_price * 6) + (cube_blue_price * 6) + (cube_stone_price * 32) + (cube_jewels_price * 8)).toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_195.png" },
      { name: "메넬리크의 서", bundleCount: 1, price: cardExp_book_price.toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_225.png" },
      { name: "태초의 조각", bundleCount: 1, price: cardExp_taecho_price.toFixed(0), icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_224.png" }
    ];
    setAllItemList(mergedList);

  }, [marketsPrice, crystalPrice]);

  useEffect(() => {
    if (!selectedPackageData) return;

    setPackageType(selectedPackageData.PACKAGE_TYPE);
    setPackageName(selectedPackageData.PACKAGE_NAME);
    setPackagePrice(selectedPackageData.PACKAGE_PRICE);
    setPackageCount(selectedPackageData.PACKAGE_COUNT);
    setDicoPrice(selectedPackageData.DICO_PRICE || '');
    const updatedItems = (selectedPackageData.ITEMS || []).map((item) => {
      const marketItem =
        allItemList.find((m) => m.name === item.name) || {};

      return {
        ...item,
        price: marketItem.price
          ? marketItem.price / (marketItem.bundleCount || 1)
          : item.price, // market 가격 있으면 사용, 없으면 기존 가격 유지
      };
    });

    setItems(updatedItems);

  }, [selectedPackageData, allItemList, packageDvcd]);


  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    setResult(null);
  };

  const handleItemSelect = (item) => {
    setItems([
      ...items,
      {
        name: item.name,
        icon: item.icon,
        bundleCount: item.bundleCount,
        count: 1,
        price: (item.price / item.bundleCount) || 0,
      },
    ]);
    setResult(null);
  };

  const addItem = () => {
    setIsModalOpen(true);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    setResult(null);
  };

  const calculate = () => {
    if (!packageType) {
      setError("패키지 구분을 입력해주세요.");
      return;
    }
    if (!packagePrice) {
      setError("패키지 가격을 입력해주세요.");
      return;
    }
    if (!packageCount) {
      setError("패키지 수량을 입력해주세요.");
      return;
    }
    if (items.length < 1) {
      setError("구성품을 입력해주세요.");
      return;
    }
    const totalItemGold = items.reduce((sum, item) => {
      const count = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (count * price) * (parseFloat(packageCount) || 0);
    }, 0);

    const totalPackageValue = nowCrystalPrice * ((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0) * 1.05);

    const efficiencyCalc = ((totalItemGold - totalPackageValue) / totalPackageValue) * 100;

    setPackageBuyPrice((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0));
    setPackageBuyGold(totalPackageValue);
    setItemGold(totalItemGold);
    setEfficiency(efficiencyCalc.toFixed(1));
    setDifferencePrice(totalItemGold - totalPackageValue);

    setResult({
      totalPackageGold: totalPackageValue,
      efficiency: efficiencyCalc.toFixed(2),
      totalItemGold
    });
  };

  const calculateRoyal = () => {
    if (!packageType) {
      setError("패키지 구분을 입력해주세요.");
      return;
    }
    if (!packagePrice) {
      setError("패키지 가격을 입력해주세요.");
      return;
    }
    if (!packageCount) {
      setError("패키지 수량을 입력해주세요.");
      return;
    }
    if (items.length < 1) {
      setError("구성품을 입력해주세요.");
      return;
    }
    // 1100원 = 40크리스탈
    const totalPackageValue = ((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0)) / 1100 * 40 * nowCrystalPrice;

    const totalItemGold = items.reduce((sum, item) => {
      const count = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (count * price) * (parseFloat(packageCount) || 0);
    }, 0);

    // const totalPackageValue = nowCrystalPrice * ((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0));

    const efficiencyCalc = ((totalItemGold - totalPackageValue) / totalPackageValue) * 100;

    setPackageBuyPrice((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0));
    setPackageBuyGold(totalPackageValue);
    setItemGold(totalItemGold);
    setEfficiency(efficiencyCalc.toFixed(1));
    setDifferencePrice(totalItemGold - totalPackageValue);

    setResult({
      totalPackageGold: totalPackageValue,
      efficiency: efficiencyCalc.toFixed(1),
      totalItemGold
    });
  };

  // 디코 거래소 게산
  const dicoCalc = (feeRate = 0.05) => {
    // 디코 1골드당 현금가
    const pricePerGold = dicoPrice / 100;

    let goldBeforeFee = 0;

    if (packageDvcd === '02') {
      goldBeforeFee = (parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0) / pricePerGold;
    } else {
      const change = packagePrice / 40 * 1100; // 블루크리스탈 -> 로열크리스탈 변환
      goldBeforeFee = (parseFloat(change) || 0) * (parseFloat(packageCount) || 0) / pricePerGold;
    }

    const gold = goldBeforeFee * (1 - feeRate);
    const diff = itemsGold - gold;
    const efficiency = (itemsGold / gold) * 100 - 100;

    setDifferenceDicoPrice(diff.toFixed(0));
    setEfficiencyDico(efficiency.toFixed(2));
    setgoldDico(Number(gold.toFixed(1)));

    return {
      gold: Number(gold.toFixed(1)), // 상태값 말고 계산값 직접 사용
      diff: diff.toFixed(0),
      efficiency: efficiency.toFixed(2)
    };
  };

  function calculateGiftSale({
    feeRate = 0.05,   // 수수료율 (기본 5%)
  }) {
    // 1100원 = 40 크리스탈 비율
    const pricePerCrystal = 1100 / 40; // 27.5원/크리스탈

    // 할인율 적용 후 실제 결제 금액
    const actualPaid = packageBuyPrice * (1 - giftSale / 100);

    // 실제 결제 금액 → 크리스탈 수량
    const crystalCount = actualPaid / pricePerCrystal;

    // 크리스탈 → 골드 환산
    const goldBeforeFee = crystalCount * nowCrystalPrice;

    // 수수료 적용
    const receivedGold = goldBeforeFee * (1 - feeRate);

    // 차익 및 효율 계산
    const diff = itemsGold - receivedGold;
    const efficiency = (itemsGold / receivedGold) * 100 - 100;

    return {
      actualPaid: actualPaid.toFixed(0),
      receivedGold: receivedGold.toFixed(0),
      diff: diff.toFixed(0),
      efficiency: efficiency.toFixed(0)
    };
  }


  const saleResult = useMemo(() => {
    return packageDvcd == '02' ? calculateGiftSale(giftSale) : null;
  }, [packageDvcd, packagePrice, packageCount, dicoPrice, itemsGold, giftSale]);

  const dicoResult = useMemo(() => {
    return dicoCalc();
  }, [packageDvcd, packagePrice, packageCount, dicoPrice, itemsGold]);

  const handleSave = () => {
    if (!result) {
      alert('먼저 효율 계산을 해주세요.');
      return;
    }

    if (/^\d+$/.test(packageName) || /^[\u1100-\u11FF\u3131-\u318Eㅏ-ㅣ]+$/.test(packageName)) {
      alert("정확한 패키지명을 입력하세요 !!!");
      return;
    }

    axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/price/package/efficiency/insert`,
      {
        packageName,
        packagePrice,
        packageCount,
        packageDvcd,
        packageType,
        items,
        packageBuyPrice,
        packageBuyGold,
        itemsGold,
        differencePrice,
        efficiency,

        dicoPrice: dicoPrice || 0,
        differenceDicoPrice,
        efficiencyDico
      }
    )
      .then(() => alert('저장 완료!'))
      .catch(() => alert('저장 중 오류가 발생했습니다.'));
  };

  const ItemSelectModal = ({ itemList, onSelect, onClose }) => {
    const handleBackgroundClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto relative transition-all duration-300">
          {/* 닫기 버튼 (상단 우측) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-100 dark:text-gray-300 bg-red-500"
            aria-label="닫기"
          >
            ✕
          </button>

          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            아이템 선택
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {itemList
              .filter(item => !item.name.includes('야금') && !item.name.includes('재봉'))
              .sort((a, b) => b.tier - a.tier)
              .map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="cursor-pointer border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 flex items-center gap-3 transition-all duration-200"
                >
                  {item.name === '크리스탈' ? (
                    <span
                      className="w-[19px] h-[21px] inline-block"
                      style={{
                        backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
                        backgroundPosition: '-395px -198px',
                        backgroundSize: '606px 393px',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></span>
                  ) : (
                    <img src={item.icon} alt={item.name} className="w-6 h-6 rounded" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-500">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span
            className="w-[19px] h-[21px] inline-block"
            style={{
              backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
              backgroundPosition: packageDvcd === '01' ? '-395px -198px' : '-337px -248px',
              backgroundSize: '606px 393px',
              backgroundRepeat: 'no-repeat',
            }}
          ></span>
          크리스탈 패키지 효율 계산기
        </h2>
        <div className="relative group">
          <span className="text-blue-600 cursor-pointer dark:text-blue-300">📘설명서</span>
          <div className="absolute left-1/2 -translate-x-[50%] top-7 w-[28rem] p-3 bg-blue-50 border border-blue-200 rounded shadow-md text-xs text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
              <li><strong>큐브 입장권 단가는 숨결, 돌파석, 2레벨 보석 기준으로 계산됩니다.</strong></li>
              <li><strong>카드 경험치는 마일리지 샵 기준 골드 환산 단가로 계산됩니다.</strong></li>
              <li>구성품 수량은 상자가 아닌, 상자 안의 아이템 개수로 입력해주세요.</li>
              <li>구성품 단가는 1개당 가격 기준으로 계산됩니다.</li>
              <li>단가는 실시간 시세 기준으로 자동 설정됩니다.</li>
              <li>‘효율 계산’ 버튼을 누르면 패키지 효율이 계산됩니다.</li>
              <li>‘저장’ 버튼을 누르면 모든 사용자에게 리스트가 공개됩니다.</li>
              <li>모든 계산은 화폐거래소의 크리스탈 시세 기준으로 진행됩니다.</li>
              {packageDvcd === '01' && (
                <li>블루 크리스탈 환산 시 5% 수수료가 적용됩니다.</li>
              )}
              {packageDvcd === '02' && (
                <li>로열 크리스탈은 1,100원 = 크리스탈 40으로 환산됩니다.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="mb-4 space-y-2 pr-4 max-w-lg mx-auto">
          <div className="text-sm font-bold mb-4 flex items-center gap-2"> 100 <span
            className="w-[19px] h-[21px] inline-block"
            style={{
              backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
              backgroundPosition: '-395px -198px',
              backgroundSize: '606px 393px',
              backgroundRepeat: 'no-repeat',
            }}
          ></span> → {(nowCrystalPrice * 100).toLocaleString()}G </div>

          {packageDvcd === '02' && (
            <div className="text-sm font-bold mb-4 flex items-center gap-2">
              <span
                className="w-[19px] h-[21px] inline-block"
                style={{
                  backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
                  backgroundPosition: packageDvcd === '01' ? '-395px -198px' : '-337px -248px',
                  backgroundSize: '606px 393px',
                  backgroundRepeat: 'no-repeat',
                }}
              ></span>
              1,100 →
              <span
                className="w-[19px] h-[21px] inline-block"
                style={{
                  backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
                  backgroundPosition: packageDvcd === '02' ? '-395px -198px' : '-337px -248px',
                  backgroundSize: '606px 393px',
                  backgroundRepeat: 'no-repeat',
                }}
              ></span>
              40
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">패키지명</label>
          <div className="flex gap-2 items-center w-[530px]">
            <select
              value={packageType}
              onChange={(e) => {
                setPackageType(e.target.value);
                setResult(null);
              }}
              required
              className="border p-2 rounded w-40 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition duration-200">
              <option value="" disabled>
                — 선택하세요 —
              </option>
              {PACKAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>


            <input
              type="text"
              placeholder="패키지명"
              value={packageName}
              onChange={(e) => {
                setPackageName(e.target.value);
                setResult(null);
              }}
              required
              className="border p-2 rounded flex-1"
            />
          </div>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">패키지 가격</label>
          <input
            type="number"
            placeholder="패키지 가격"
            value={packagePrice}
            onChange={(e) => {
              setPackagePrice(e.target.value);
              setResult(null);
            }}
            required
            className="border p-2 w-full rounded"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">구매 가능 횟수</label>
          <input
            type="number"
            placeholder="구매 가능 횟수"
            value={packageCount}
            min={1}
            max={3}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);

              if (value >= 1 && value <= 3) {
                setPackageCount(value);
              } else if (e.target.value === '') {
                setPackageCount(''); // 빈 문자열 입력 허용 시
              }

              setResult(null);
            }}
            required
            className="border p-2 w-full rounded"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            어둠 경로 가격 (100 : 가격)
          </label>
          <input
            type="number"
            placeholder="가격 (ex 20)"
            value={dicoPrice}
            onChange={(e) => {
              setDicoPrice(e.target.value);
              setResult(null);
            }}
            className="border p-2 w-full rounded"
          />
          {packageDvcd === '02' && (
            <>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                상품권 할인율 %
              </label>
              <input
                type="number"
                placeholder="ex) 5"
                value={giftSale}
                onChange={(e) => {
                  setGiftSale(e.target.value);
                  setResult(null);
                }}
                className="border p-2 w-full rounded"
              />
            </>
          )}
        </div>

        <h4 className="mt-6 mb-2 font-semibold text-lg">📦 구성품 (1 패키지 기준)</h4>

        <div className="flex text-xs font-bold text-gray-500 dark:text-gray-300 mb-1">
          <div className="flex-1">이름</div>
          <div className="w-24 text-center">수량</div>
          <div className="w-28 text-center">단가 (G)</div>
          <div className="w-8"></div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              value={item.name}
              readOnly
              className="border p-2 bg-gray-100 cursor-not-allowed flex-1 text-sm"
            />
            <input
              type="number"
              value={item.count}
              onChange={(e) => handleItemChange(index, 'count', e.target.value)}
              min={0}
              className="border p-2 w-24 text-center"
            />
            <input
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              className="border p-2 w-28 text-center"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-600 hover:text-red-800 text-lg"
              title="삭제"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          ➕ 구성품 추가
        </button>

        <button
          type="button"
          onClick={packageDvcd === '01' ? calculate : calculateRoyal}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📊 효율 계산
        </button>

        {result && (
          <div className="mt-6 p-4 rounded bg-gray-100 dark:bg-gray-600 text-sm space-y-4">

            {/* 패키지 기본 정보 */}
            <div className="grid grid-cols-2 gap-2">
              <div><strong>패키지 구매 비용</strong></div>
              <div className="text-right">{packageBuyPrice.toLocaleString()}{packageDvcd == '01' ? '크리스탈' : '원'}</div>

              <div><strong>구성품 총 가치</strong></div>
              <div className="text-right">{itemsGold.toLocaleString()}G</div>
            </div>

            {packageDvcd == '02' && giftSale > 0 && saleResult && (
              <div className="p-3 rounded bg-gray-200 dark:bg-gray-700 shadow">
                <p className="font-semibold mb-2">상품권 할인</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>구매 비용</strong>
                    <span className="text-xs text-gray-400"> {giftSale}% 할인</span>
                  </div>
                  <div className="text-right">{Number(saleResult.actualPaid).toLocaleString()}원</div>
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>환산 골드</strong>
                    <span className="text-xs text-gray-400"> 5% 수수료 차감</span>
                  </div>
                  <div className="text-right">{Number(saleResult.receivedGold).toLocaleString()}</div>

                  <div><strong>이득/손해</strong></div>
                  <div className={`text-right font-bold ${saleResult.diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(saleResult.diff).toLocaleString()}
                  </div>

                  <div><strong>패키지 효율</strong></div>
                  <div className={`text-right font-bold ${saleResult.efficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {saleResult.efficiency}% {saleResult.efficiency >= 0 ? '이득' : '손해'}
                  </div>
                </div>
              </div>
            )}

            {/* 화폐 거래소 기준 */}
            <div className="mt-4 p-3 rounded bg-white dark:bg-gray-800 shadow">
              <p className="font-semibold mb-2">화폐 거래소 기준</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>환산 골드</strong>
                  <span className="text-xs text-gray-400"> 5% 수수료 차감</span>
                </div>
                <div className="text-right">{packageBuyGold.toLocaleString()}</div>

                <div><strong>이득/손해</strong></div>
                <div className={`text-right font-bold ${differencePrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {differencePrice.toLocaleString()}
                </div>

                <div><strong>패키지 효율</strong></div>
                <div className={`text-right font-bold ${efficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {efficiency}% {efficiency >= 0 ? '이득' : '손해'}
                </div>
              </div>
            </div>
            {/* 어둠 경로 기준 */}
            {dicoResult && (
              <div className="p-3 rounded bg-gray-200 dark:bg-gray-700 shadow">
                <p className="font-semibold mb-2">어둠 경로 기준 (100 : {dicoPrice})</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>환산 골드</strong>
                    <span className="text-xs text-gray-400"> 5% 수수료 차감</span>
                  </div>

                  <div className="text-right">{goldDico.toLocaleString()}</div>

                  <div><strong>이득/손해</strong></div>
                  <div className={`text-right font-bold ${dicoResult.diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(dicoResult.diff).toLocaleString()}
                  </div>

                  <div><strong>패키지 효율</strong></div>
                  <div className={`text-right font-bold ${dicoResult.efficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dicoResult.efficiency}% {dicoResult.efficiency >= 0 ? '이득' : '손해'}
                  </div>
                </div>
              </div>
            )}

            {/* 저장 버튼 */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                저장하기
              </button>
            </div>
          </div>
        )}
      </form>

      {isModalOpen && (
        <ItemSelectModal
          itemList={allItemList}
          onSelect={handleItemSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

function PackageList({ onSelectPackage }) {
  const [allPackageList, setAllPackageList] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  const getPackageList = () => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/package/efficiency/list`)
      .then(res => setAllPackageList(res.data.packageList))
      .catch(() => alert('리스트 불러오기 실패'));
  };

  const handleRemovePackage = (packageName) => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/package/efficiency/delete?packageName=${packageName}`)
      .then(() => getPackageList())
      .catch(() => alert(`[${packageName}] 삭제 실패`));
  };

  useEffect(() => {
    getPackageList();
  }, []);

  // 필터링 데이터
  const filteredList =
    selectedType === 'all'
      ? allPackageList
      : allPackageList.filter((item) => item.PACKAGE_TYPE === selectedType);

  // 필터 데이터 존재 여부 확인
  const typeCounts = useMemo(() => {
    const counts = {};

    for (const item of allPackageList) {
      counts[item.PACKAGE_TYPE] = (counts[item.PACKAGE_TYPE] || 0) + 1;
    }

    return counts;
  }, [allPackageList]);

  return (
    <>
      <div className="flex gap-2 mb-4 justify-center">
        {[{ label: '전체', value: 'all' }, ...PACKAGE_TYPES].map((type) => {
          const isDisabled =
            allPackageList.length === 0 || // 전체가 아예 없거나
            (type.value !== 'all' && !typeCounts[type.value]); // 특정 타입이 없을 경우

          return (
            <button
              key={type.value}
              onClick={() => {
                if (!isDisabled) setSelectedType(type.value);
              }}
              disabled={isDisabled}
              className={`px-3 py-1 rounded text-sm font-medium border transition
          ${selectedType === type.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredList.map((item, idx) => {
          const isProfit = parseFloat(item.EFFICIENCY) >= 0;
          const isProfitDico = parseFloat(item.EFFICIENCY_DICO) >= 0;
          return (
            <div
              key={idx}
              onClick={() => onSelectPackage(item)}
              className="relative border rounded-lg p-4 shadow-md bg-white dark:bg-gray-700"
            >
              {localStorage.getItem('user') == 'cgm97@naver.com' && (
                <>
                  {/* ❌ X 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePackage(item.PACKAGE_NAME);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-xl dark:bg-gray-500"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </>
              )}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                  {item.PACKAGE_DVCD === '01' && (
                    <span
                      className="w-[19px] h-[21px] inline-block"
                      style={{
                        backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
                        backgroundPosition: '-395px -198px',
                        backgroundSize: '606px 393px',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></span>
                  )}
                  {item.PACKAGE_DVCD === '02' && (
                    <span
                      className="w-[18px] h-[21px] inline-block"
                      style={{
                        backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
                        backgroundPosition: '-337px -248px',
                        backgroundSize: '606px 393px',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></span>
                  )}
                  [{PACKAGE_TYPES.find((type) => type.value === item.PACKAGE_TYPE).label}] {item.PACKAGE_NAME}
                </h3>
                <span className="ml-auto text-xs text-gray-400">
                  화폐거래소 기준 계산
                  ({item.LST_DTTI})
                </span>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  💠 패키지 가격: {item.PACKAGE_PRICE.toLocaleString()} × {item.PACKAGE_COUNT} ={' '}
                  <strong>{item.PACKAGE_BUY_PRICE.toLocaleString()}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  💰 패키지 환산 골드: <strong>{item.PACKAGE_BUY_GOLD.toLocaleString()} G</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📦 구성품 총 가치: <strong>{item.ITEMS_GOLD.toLocaleString()} G</strong>
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {item.ITEMS.map((subItem, subIdx) => (
                    <div
                      key={subIdx}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 p-2 rounded"
                    >
                      {subItem.name === "크리스탈" ? (
                        <span
                          className="w-[19px] h-[21px] inline-block"
                          style={{
                            backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
                            backgroundPosition: '-395px -198px',
                            backgroundSize: '606px 393px',
                            backgroundRepeat: 'no-repeat',
                          }}
                        ></span>
                      ) : (
                        <img
                          src={subItem.icon}
                          alt={subItem.name}
                          className="w-6 h-6 rounded"
                        />
                      )}
                      <div className="text-sm">
                        <p className="font-medium text-gray-800 dark:text-white">{subItem.name} {Number(subItem.count).toLocaleString()} X {item.PACKAGE_COUNT} </p>
                        <p className="text-gray-600 dark:text-gray-300">{(Number(subItem.count * item.PACKAGE_COUNT)).toLocaleString()}개 (개당 {subItem.price.toLocaleString()}G)</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mt-3">
                  {/* 화폐거래소 기준 */}
                  <div className="p-3 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-600">
                    <div className="text-xs text-gray-500 mb-1">화폐거래소 기준</div>
                    <p className="text-sm">
                      차익:{' '}
                      <span className={isProfit ? 'text-green-500' : 'text-red-500'}>
                        {item.DIFFERENCE_PRICE.toLocaleString()}G
                      </span>{' '}
                      / 효율:{' '}
                      <span className={isProfit ? 'text-green-500' : 'text-red-500'}>
                        {item.EFFICIENCY}% {isProfit ? '이득' : '손해'}
                      </span>
                    </p>
                  </div>

                  {/* 어둠 경로 기준 */}
                  {item.DICO_PRICE > 0 && (
                    <div className="p-3 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-600">
                      <div className="text-xs text-gray-500 mb-1">
                        어둠의 경로 기준 (100 : {item.DICO_PRICE})
                      </div>
                      <p className="text-sm">
                        차익:{' '}
                        <span className={isProfitDico ? 'text-green-500' : 'text-red-500'}>
                          {Number(item.DIFFERENCE_DICO_PRICE).toLocaleString()}G
                        </span>{' '}
                        / 효율:{' '}
                        <span className={isProfitDico ? 'text-green-500' : 'text-red-500'}>
                          {item.EFFICIENCY_DICO}% {isProfitDico ? '이득' : '손해'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function PackageEfficiencyPage({ marketsPrice, crystalPrice, jewelsPrice }) {
  const [activeTab, setActiveTab] = useState('calc1');
  const [selectedPackageData01, setSelectedPackageData01] = useState(null);
  const [selectedPackageData02, setSelectedPackageData02] = useState(null);

  useEffect(() => {
    const path = `/efficiency/package/${activeTab}`;
    const title = `${activeTab === "calc1" ? "블크계산기" : activeTab === "calc2" ? "로크계산기" : "패키지효율리스트"} | LOAGAP`;

    // Google Analytics (GA4)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.href,
      });
    }

  }, [activeTab]);

  return (
    <>
      {/* 탭 */}
      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={() => setActiveTab('calc1')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'calc1' ? 'bg-blue-600 text-white dark:bg-blue-800' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}
        >
          <span
            className="w-[19px] h-[21px] inline-block"
            style={{
              backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
              backgroundPosition: '01' === '01' ? '-395px -198px' : '-337px -248px',
              backgroundSize: '606px 393px',
              backgroundRepeat: 'no-repeat',
            }}
          ></span>
          계산기
        </button>
        <button
          onClick={() => setActiveTab('calc2')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'calc2' ? 'bg-blue-600 text-white dark:bg-blue-800' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}
        >
          <span
            className="w-[19px] h-[21px] inline-block"
            style={{
              backgroundImage: `url("https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_shop.png?01ff928ef1fbd38c0933")`,
              backgroundPosition: '-337px -248px', // 'calc2'라서 02 위치
              backgroundSize: '606px 393px',
              backgroundRepeat: 'no-repeat',
            }}
          ></span>
          계산기
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded ${activeTab === 'list' ? 'bg-blue-600 text-white dark:bg-blue-800' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}
        >
          패키지 효율 리스트
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'calc1' && (
        <PackageCalc
          packageDvcd="01"
          marketsPrice={marketsPrice}
          crystalPrice={crystalPrice}
          jewelsPrice={jewelsPrice}
          selectedPackageData={selectedPackageData01}
        />
      )}
      {activeTab === 'calc2' && (
        <PackageCalc
          packageDvcd="02"
          marketsPrice={marketsPrice}
          crystalPrice={crystalPrice}
          jewelsPrice={jewelsPrice}
          selectedPackageData={selectedPackageData02}
        />
      )}
      {activeTab === 'list' &&
        <PackageList onSelectPackage={(pkg) => {
          if (pkg.PACKAGE_DVCD === '01') {
            setSelectedPackageData01(pkg);
            setActiveTab('calc1');
          } else {
            setSelectedPackageData02(pkg);
            setActiveTab('calc2');
          }
          setActiveTab(pkg.PACKAGE_DVCD === '02' ? 'calc2' : 'calc1');
        }} />}
    </>
  );
}
