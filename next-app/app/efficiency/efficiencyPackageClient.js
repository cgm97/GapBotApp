'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function PackageCalc({ packageDvcd, marketsPrice, crystalPrice, selectedPackageData }) {
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [packageCount, setPackageCount] = useState('');
  const [dicoPrice, setDicoPrice] = useState('');
  const [items, setItems] = useState([]);
  const [result, setResult] = useState(null);
  const [allItemList, setAllItemList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nowCrystalPrice, setNowCrystalPrice] = useState(0);

  // 계산 결과용 상태
  const [packageBuyPrice, setPackageBuyPrice] = useState(0);
  const [packageBuyGold, setPackageBuyGold] = useState(0);
  const [itemsGold, setItemGold] = useState(0);
  const [differencePrice, setDifferencePrice] = useState(0);
  const [efficiency, setEfficiency] = useState(0);

  const [differenceDicoPrice, setDifferenceDicoPrice] = useState(0);
  const [efficiencyDico, setEfficiencyDico] = useState(0);
  const [goldDico, setgoldDico] = useState(0);

  useEffect(() => {
    if (!marketsPrice) return;
    const mergedList = [
      ...marketsPrice.강화재료.map(item => ({ ...item, category: '강화재료' })),
      ...marketsPrice.강화추가재료.map(item => ({ ...item, category: '강화추가재료' })),
    ];
    setAllItemList(mergedList);

    setNowCrystalPrice(crystalPrice[crystalPrice.length - 1].close / 100);
  }, [marketsPrice, crystalPrice]);

  useEffect(() => {
    if (!selectedPackageData) return;

    setPackageName(selectedPackageData.PACKAGE_NAME);
    setPackagePrice(selectedPackageData.PACKAGE_PRICE);
    setPackageCount(selectedPackageData.PACKAGE_COUNT);

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

    if (packageDvcd === '02') {
      setDicoPrice(selectedPackageData.DICO_PRICE || '');
    }
  }, [selectedPackageData, allItemList, packageDvcd]);


  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleItemSelect = (item) => {
    setItems([
      ...items,
      {
        name: item.name,
        icon: item.icon,
        bundleCount: item.bundleCount,
        count: 0,
        price: (item.price / item.bundleCount) || 0,
      },
    ]);
  };

  const addItem = () => {
    setIsModalOpen(true);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const calculate = () => {
    const totalItemGold = items.reduce((sum, item) => {
      const count = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (count * price) * (parseFloat(packageCount) || 0);
    }, 0);

    const totalPackageValue = nowCrystalPrice * ((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0) * 1.05);

    const efficiencyCalc = ((totalItemGold - totalPackageValue) / totalItemGold) * 100;

    setPackageBuyPrice((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0));
    setPackageBuyGold(totalPackageValue);
    setItemGold(totalItemGold);
    setEfficiency(efficiencyCalc.toFixed(2));
    setDifferencePrice(totalItemGold - totalPackageValue);

    setResult({
      totalPackageGold: totalPackageValue,
      efficiency: efficiencyCalc.toFixed(2),
      totalItemGold
    });
  };

  const calculateRoyal = () => {

    // 1100원 = 40크리스탈
    const totalPackageValue = ((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0)) / 1100 * 40 * nowCrystalPrice;

    const totalItemGold = items.reduce((sum, item) => {
      const count = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (count * price) * (parseFloat(packageCount) || 0);
    }, 0);

    // const totalPackageValue = nowCrystalPrice * ((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0));

    const efficiencyCalc = ((totalItemGold - totalPackageValue) / totalItemGold) * 100;

    setPackageBuyPrice((parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0));
    setPackageBuyGold(totalPackageValue);
    setItemGold(totalItemGold);
    setEfficiency(efficiencyCalc.toFixed(2));
    setDifferencePrice(totalItemGold - totalPackageValue);

    setResult({
      totalPackageGold: totalPackageValue,
      efficiency: efficiencyCalc.toFixed(2),
      totalItemGold
    });
  };

  // 디코 거래소 게산
  const dicoCalc = (feeRate = 0.05) => {

    // 100 : dicoPrice -> 1 : gold 변환
    const pricePerGold = dicoPrice / 100; // 0.2원

    const goldBeforeFee = (parseFloat(packagePrice) || 0) * (parseFloat(packageCount) || 0) / pricePerGold;

    // 수수료 반영 (실수령 골드)
    const gold = goldBeforeFee * (1 - feeRate);

    // 구성품 가치와 비교한 차익
    const diff = itemsGold - gold;
    const efficiency = (itemsGold / gold) * 100 - 100;

    setDifferenceDicoPrice(diff.toFixed(0));
    setEfficiencyDico(efficiency.toFixed(2));
    setgoldDico(gold);
    return {
      gold: goldDico,
      diff: diff.toFixed(0),
      efficiency: efficiency.toFixed(2)
    };
  }

  const dicoResult = useMemo(() => {
    if (packageDvcd === '02') return dicoCalc();
    return null;
  }, [packageDvcd, packagePrice, packageCount, dicoPrice, itemsGold]);

  const handleSave = () => {
    if (!result) {
      alert('먼저 효율 계산을 해주세요.');
      return;
    }
    axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/price/package/efficiency/insert`,
      {
        packageName,
        packagePrice,
        packageCount,
        packageDvcd,
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

  const ItemSelectModal = ({ itemList, onSelect, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto dark:bg-gray-800">
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
        <h3 className="text-xl font-bold mb-4">아이템 선택</h3>
        <div className="grid grid-cols-3 gap-4">
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
                className="cursor-pointer border p-2 rounded hover:bg-gray-500 flex items-center gap-2"
              >
                <img src={item.icon} alt={item.name} className="w-8 h-8" />
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

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
          <div className="absolute left-1/2 -translate-x-[50%] top-7 w-96 p-3 bg-blue-50 border border-blue-200 rounded shadow-md text-xs text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
            <ul className="list-disc list-inside space-y-1">
              <li>모든 구성품 수량은 1패키지 기준 상자 수량이 아닌, 상자 안의 아이템 개수로 입력해주세요.</li>
              <li>모든 구성품의 단가는 1개당 가격을 기준으로 계산됩니다.</li>
              <li>구성품 단가는 실시간 시세에 따라 자동으로 세팅됩니다.</li>
              <li>‘효율 계산’ 버튼을 누르면 크리스탈 패키지 효율이 계산됩니다.</li>
              <li>‘저장’ 버튼을 누르면, 모든 사용자가 패키지 효율 리스트를 상단 탭에서 확인할 수 있습니다.</li>
              <li>모든 계산은 화폐거래소 크리스탈 시세를 기준으로 진행됩니다.</li>
              {packageDvcd === '01' && (
                <li>골드 → 크리스탈 환산 시 수수료 5%가 적용됩니다.</li>
              )}
              {packageDvcd === '02' && (
                <li>로얄크리스탈 1,100원 → 크리스탈 40으로 계산됩니다.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="mb-4 space-y-2 pr-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">패키지 이름</label>
          <input
            type="text"
            placeholder="패키지 이름"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">패키지 가격</label>
          <input
            type="number"
            placeholder="패키지 가격"
            value={packagePrice}
            onChange={(e) => setPackagePrice(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">구매 가능 횟수</label>
          <input
            type="number"
            placeholder="구매 가능 횟수"
            value={packageCount}
            onChange={(e) => setPackageCount(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />

          {packageDvcd === '02' && (
            <>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                어둠 경로 가격 (100 : 가격)
              </label>
              <input
                type="number"
                placeholder="가격 (ex 20)"
                value={dicoPrice}
                onChange={(e) => setDicoPrice(e.target.value)}
                required
                className="border p-2 w-full rounded"
              />
            </>
          )}
        </div>

        <h4 className="mt-6 mb-2 font-semibold text-lg">📦 구성품</h4>

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
              readOnly
              className="border p-2 w-28 bg-gray-100 text-center cursor-not-allowed"
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
              <div className="text-right">{packageBuyPrice.toLocaleString()} 크리스탈</div>

              <div><strong>구성품 총 가치</strong></div>
              <div className="text-right">{itemsGold.toLocaleString()} G</div>
            </div>

            {/* 화폐 거래소 기준 */}
            <div className="mt-4 p-3 rounded bg-white dark:bg-gray-800 shadow">
              <p className="font-semibold mb-2">화폐 거래소 기준</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>환산 골드</strong>
                    <span className="text-xs text-gray-400"> 5% 수수료 차감</span>
                  </div>
                <div className="text-right">{packageBuyGold.toLocaleString()} G</div>

                <div><strong>이득/손해</strong></div>
                <div className={`text-right font-bold ${differencePrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {differencePrice.toLocaleString()} G
                </div>

                <div><strong>패키지 효율</strong></div>
                <div className={`text-right font-bold ${efficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {efficiency}% {efficiency >= 0 ? '이득' : '손해'}
                </div>
              </div>
            </div>

            {/* 어둠 경로 기준 */}
            {packageDvcd === '02' && dicoResult && (
              <div className="p-3 rounded bg-gray-200 dark:bg-gray-700 shadow">
                <p className="font-semibold mb-2">어둠 경로 기준 (100 : {dicoPrice})</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>환산 골드</strong>
                    <span className="text-xs text-gray-400"> 5% 수수료 차감</span>
                  </div>

                  <div className="text-right">{goldDico.toLocaleString()} G</div>

                  <div><strong>이득/손해</strong></div>
                  <div className={`text-right font-bold ${dicoResult.diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(dicoResult.diff).toLocaleString()} G
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
    </div>
  );
}

function PackageList({ onSelectPackage }) {
  const [allPackageList, setAllPackageList] = useState([]);

  const getPackageList = () => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/package/efficiency/list`)
      .then(res => setAllPackageList(res.data.packageList))
      .catch(() => alert('리스트 불러오기 실패'));
  };

  const handleRemovePackage = (packageName) => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/package/efficiency/delete?packageName=${packageName}`)
      .then(getPackageList())
      .catch(() => alert(`[${packageName}] 삭제 실패`));
  };

  useEffect(() => {
    getPackageList();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {allPackageList.map((item, idx) => {
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
                  onClick={() => handleRemovePackage(item.PACKAGE_NAME)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-xl"
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
                {item.PACKAGE_NAME}
              </h3>
              <span className="ml-auto text-xs text-gray-400">
                화폐거래소 기준 계산
                ({item.LST_DTTI})
              </span>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                💠 패키지 가격: {item.PACKAGE_PRICE} × {item.PACKAGE_COUNT} ={' '}
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
                    <img
                      src={subItem.icon}
                      alt={subItem.name}
                      className="w-6 h-6 rounded"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-800 dark:text-white">{subItem.name}</p>
                      <p className="text-gray-600 dark:text-gray-300">{subItem.count}개 (1개당 {subItem.price}G)</p>
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
                      {item.DIFFERENCE_PRICE.toLocaleString()} G
                    </span>{' '}
                    / 효율:{' '}
                    <span className={isProfit ? 'text-green-500' : 'text-red-500'}>
                      {item.EFFICIENCY}% {isProfit ? '이득' : '손해'}
                    </span>
                  </p>
                </div>

                {/* 어둠 경로 기준 */}
                {item.PACKAGE_DVCD === '02' && item.DICO_PRICE > 0 && (
                  <div className="p-3 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-600">
                    <div className="text-xs text-gray-500 mb-1">
                      어둠의 경로 기준 (100 : {item.DICO_PRICE})
                    </div>
                    <p className="text-sm">
                      차익:{' '}
                      <span className={isProfitDico ? 'text-green-500' : 'text-red-500'}>
                        {Number(item.DIFFERENCE_DICO_PRICE).toLocaleString()} G
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
  );
}

export default function PackageEfficiencyPage({ marketsPrice, crystalPrice }) {
  const [activeTab, setActiveTab] = useState('calc1');
  const [selectedPackageData01, setSelectedPackageData01] = useState(null);
  const [selectedPackageData02, setSelectedPackageData02] = useState(null);

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
          className={`px-4 py-2 rounded ${activeTab === 'list' ? 'bg-blue-600 text-white dark:bg-blue-800 dark:text-black' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}
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
          selectedPackageData={selectedPackageData01}
        />
      )}
      {activeTab === 'calc2' && (
        <PackageCalc
          packageDvcd="02"
          marketsPrice={marketsPrice}
          crystalPrice={crystalPrice}
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
