'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdSense from '@/components/Adsense';
const itemNameMap = {
  fate_destruction_stone: {
    label: '운명의 파괴석',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png',
  },
  fate_guardian_stone: {
    label: '운명의 수호석',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png',
  },
  fate_leapstone: {
    label: '운명의 돌파석',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png',
  },
  fate_shard: {
    label: '운명의 파편',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_93.png',
  },
  abyss_fusion_material: {
    label: '아비도스 융화 재료',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_86.png',
  },
  lava_breath: {
    label: '용암의 숨결',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_171.png',
  },
  glacier_breath: {
    label: '빙하의 숨결',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_172.png',
  },
  metallurgy_flame_11_14: {
    label: '야금술 : 업화 [11-14]',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_218.png',
  },
  tailoring_flame_11_14: {
    label: '재봉술 : 업화 [11-14]',
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_218.png',
  },
  tailoring_flame_1_10: {
    label: "장인의 재봉술 : 1단계",
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_243.png',
  },
  tailoring_flame_10_20: {
    label: "장인의 재봉술 : 2단계",
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_245.png',
  },
  metallurgy_flame_1_10: {
    label: "장인의 야금술 : 1단계",
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_242.png',
  },
  metallurgy_flame_10_20: {
    label: "장인의 야금술 : 2단계",
    icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_244.png',
  },
};

const itemGroups = [
  {
    title: "방어구 재료",
    icon: "",
    keys: [
      "fate_guardian_stone",
      "glacier_breath",
      "tailoring_flame_1_10",
      "tailoring_flame_10_20",
      "tailoring_flame_11_14",
    ],
  },
  {
    title: "무기 재료",
    icon: "",
    keys: [
      "fate_destruction_stone",
      "lava_breath",
      "metallurgy_flame_1_10",
      "metallurgy_flame_10_20",
      "metallurgy_flame_11_14",
    ],
  },
  {
    title: "공통 재료",
    icon: "",
    keys: [
      "fate_leapstone",
      "fate_shard",
      "abyss_fusion_material",
    ],
  },
];


const enhanceList = {
  "10": 1640,
  "11": 1645,
  "12": 1650,
  "13": 1655,
  "14": 1660,
  "15": 1665,
  "16": 1670,
  "17": 1675,
  "18": 1680,
  "19": 1685,
  "20": 1690,
  "21": 1695,
  "22": 1700,
  "23": 1705,
  "24": 1710,
  "25": 1715
};

function calculateEnhanceSequenceLevels(sequence) {
  const result = [];
  let currentLevel = enhanceList[sequence[0]];
  let currentEnhance = sequence[0];

  for (const step of sequence) {
    if (step.includes('-')) {
      // 상급재련 (예: "1-10")
      currentLevel += 10;
      result.push({
        label: step,
        level: currentLevel,
        type: 'advanced',
      });
    } else {
      // 일반 강화 단계 (예: "16", "19" 등)
      const nextEnhance = parseInt(step, 10);
      const diff = nextEnhance - currentEnhance;
      currentLevel += diff * 5;
      result.push({
        label: step,
        level: currentLevel,
        type: 'enhance',
      });
      currentEnhance = nextEnhance;
    }
  }
  return result;
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 어둡게 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* 모달 박스 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
          <div className="max-h-100 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
            {children}
          </div>
          <button
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
          <div>
<AdSense adSlot="1488834693" />
          </div>
          
        </div>
        
      </div>
    </>
  );
}

export default function EnhanceClient({ enhanceData: initialEnhanceData }) {

  const [selectedItems, setSelectedItems] = useState(Object.keys(itemNameMap));
  const [loading, setLoading] = useState(false);
  const [enhanceData, setEnhanceData] = useState(initialEnhanceData); // 초기 값

  const [armorLevel, setArmorLevel] = useState([]); // 초기 값
  const [weaponLevel, setWeaponLevel] = useState([]); // 초기 값

  // 모달 관련 상태 추가
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMaterials, setModalMaterials] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  // 모달 열기 함수
  const openModalWithMaterials = (level, materials) => {
    setModalTitle(`${level} 평균 소모 재료`);
    setModalMaterials(materials);
    setModalOpen(true);
  };

  // 예시: 방어구 일반재련 테이블 행 클릭시 모달 열기
  const onArmorRowClick = (item) => {
    openModalWithMaterials(item.level, item.materials || []);
  };

  const fetchEnhanceData = async (items) => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/enhance`, {
        items
      });
      setEnhanceData(res.data); // 서버 응답으로 갱신

      setArmorLevel(calculateEnhanceSequenceLevels(res.data.armorSequence));
      setWeaponLevel(calculateEnhanceSequenceLevels(res.data.weaponSequence));
    } catch (err) {
      console.error('서버 요청 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 체크박스 변경 시 서버에 재요청
  const toggleItem = (key) => {
    if (key == "abyss_fusion_material") return;
    const newSelected = selectedItems.includes(key)
      ? selectedItems.filter((item) => item !== key)
      : [...selectedItems, key];

    setSelectedItems(newSelected);
    fetchEnhanceData(newSelected);
  };

  const selectAllItems = () => {
    const allKeys = Object.keys(itemNameMap);
    const newSelected = Array.from(new Set([...allKeys])); // 중복 제거
    setSelectedItems(newSelected);
    fetchEnhanceData(newSelected);
  };

  const clearSelection = () => {
    const newSelected = ['abyss_fusion_material']; // 필수 재료만 유지
    setSelectedItems(newSelected);
    fetchEnhanceData(newSelected);
  };

  // 초기에도 요청
  useEffect(() => {
    fetchEnhanceData(selectedItems);
  }, []);

  return (
    <div className="overflow-x-auto p-4 text-gray-800 dark:text-gray-200">
      {/* 상단 셀렉박스 */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        {/* 좌측: 제목 */}
        <div className="sm:max-w-[50%]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            4T 장비 기준
          </h3>
        </div>
        <div className="text-sm dark:text-gray-200 leading-relaxed sm:text-right sm:max-w-[50%]">
          각 재련 단계에서 소모되는 골드와 재료를 기반으로 1레벨당 효율을 산정한 것입니다.<br />
          계산된 결과는 참고용으로만 활용해주세요.
        </div>

        {/* 우측: 설명 */}
        <div className="text-sm dark:text-gray-200 leading-relaxed sm:text-right sm:max-w-[50%]">
          ※ 효율 계산은 아래의 모든 재료를 사용하는 것을 기준으로 하며,
          <br className="hidden sm:block" />
          <strong className="font-semibold text-gray-800 dark:text-white">귀속 재료</strong>는 본인의 상황에 따라 조정해주세요.
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <span className="text-xs dark:text-gray-100 italic">
          재련 계산식 업데이트: 2025-07-29
        </span>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={selectAllItems}
            className="text-sm px-3 py-1 border border-gray-400 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 transition"
          >
            전체선택
          </button>
          <button
            onClick={clearSelection}
            className="text-sm px-3 py-1 border border-gray-400 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 transition"
          >
            전체해제
          </button>
        </div>
      </div>

      {/* 전체 그룹 3열 정렬 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {itemGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 text-base">
              <span className="text-lg">{group.icon}</span>
              {group.title}
            </h4>

            {/* 내부 아이템들은 그대로 두세요 */}
            <div className="grid grid-cols-2 gap-2">
              {group.keys.map((key) => {
                const item = itemNameMap[key];
                const isSelected = selectedItems.includes(key);
                return (
                  <div
                    key={key}
                    onClick={() => toggleItem(key)}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all
                      ${isSelected ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'}
                      ${key === 'abyss_fusion_material' ? 'pointer-events-none opacity-80 bg-yellow-100 dark:bg-yellow-900 border-yellow-500' : ''}`}>
                    <img src={item.icon} alt={item.label} className="w-6 h-6 shrink-0" />
                    <span className="text-sm">
                      {item.label}
                      {key === 'abyss_fusion_material' && ' (필수)'}
                      {key !== 'abyss_fusion_material' && (
                        <span className="inline-block w-[3em]">
                          {!isSelected ? '(귀속)' : '\u00A0\u00A0\u00A0'}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 방어구 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold mb-2">🛡 방어구 최적의 재련 순서</h3>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              평균 소모 비용(G): {Number(enhanceData.armorTotalCost).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-1 overflow-x-auto flex-nowrap max-w-full scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {armorLevel.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold dark:text-white">
                    {step.type === 'enhance' ? `${step.label}강` : step.label}
                  </div>
                  <span className="text-sm text-black dark:text-white">
                    {step.level}
                  </span>
                </div>
                {index !== armorLevel.length - 1 && (
                  <span className="text-lg text-black dark:text-white">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <hr />
          <div>
            <h3 className="font-bold mb-2">최적 재련 평균 비용</h3>
            <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border px-2 py-1">목표 단계</th>
                  <th className="border px-2 py-1 text-right">총 비용 (G)</th>
                  <th className="border px-2 py-1 text-right">1렙당 비용 (G)</th>
                </tr>
              </thead>
              <tbody>
                {enhanceData && enhanceData.armorEnhace.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => onArmorRowClick(item)}>
                    <td className="border px-2 py-1">{(item.level).split("-")[1]}</td>
                    <td className="border px-2 py-1 text-right">{item.totalCost.toLocaleString()}</td>
                    <td className="border px-2 py-1 text-right">{item.perLevelCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div>
            <h3 className="font-bold mb-2">최적 상급재련 평균 비용</h3>
            <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border px-2 py-1">목표 단계</th>
                  <th className="border px-2 py-1 text-right">총 비용 (G)</th>
                  <th className="border px-2 py-1 text-right">1렙당 비용 (G)</th>
                </tr>
              </thead>
              <tbody>
                {enhanceData && enhanceData.armorAdvancedEnhace.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => onArmorRowClick(item)}>
                    <td className="border px-2 py-1">{item.level}</td>
                    <td className="border px-2 py-1 text-right">{item.totalCost.toLocaleString()}</td>
                    <td className="border px-2 py-1 text-right">{item.perLevelCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 무기 */}
        <div className="rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold mb-2">⚔ 무기 최적의 재련 순서</h3>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              평균 소모 비용(G): {Number(enhanceData.weaponTotalCost).toLocaleString()}G
            </span>
          </div>
          <div className="flex items-center space-x-1 overflow-x-auto flex-nowrap max-w-full scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {weaponLevel.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold dark:text-white">
                    {step.type === 'enhance' ? `${step.label}강` : step.label}
                  </div>
                  <span className="text-sm text-black dark:text-white">
                    {step.level}
                  </span>
                </div>
                {index !== weaponLevel.length - 1 && (
                  <span className="text-lg text-black dark:text-white">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <hr />
          <div>
            <h3 className="font-bold mb-2">최적 재련 평균 비용</h3>
            <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border px-2 py-1">목표 단계</th>
                  <th className="border px-2 py-1 text-right">총 비용 (G)</th>
                  <th className="border px-2 py-1 text-right">1렙당 비용 (G)</th>
                </tr>
              </thead>
              <tbody>
                {enhanceData && enhanceData.weaponEnhace.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => onArmorRowClick(item)}>
                    <td className="border px-2 py-1">{(item.level).split("-")[1]}</td>
                    <td className="border px-2 py-1 text-right">{item.totalCost.toLocaleString()}</td>
                    <td className="border px-2 py-1 text-right">{item.perLevelCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div>
            <h3 className="font-bold mb-2">최적 상급재련 평균 비용</h3>
            <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border px-2 py-1">목표 단계</th>
                  <th className="border px-2 py-1 text-right">총 비용 (G)</th>
                  <th className="border px-2 py-1 text-right">1렙당 비용 (G)</th>
                </tr>
              </thead>
              <tbody>
                {enhanceData && enhanceData.weaponAdvancedEnhace.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => onArmorRowClick(item)}>
                    <td className="border px-2 py-1">{item.level}</td>
                    <td className="border px-2 py-1 text-right">{item.totalCost.toLocaleString()}</td>
                    <td className="border px-2 py-1 text-right">{item.perLevelCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <footer className="mt-10 text-xs text-gray-500 dark:text-gray-400">
        <p>
          LOAGAP는 로스트아크 유저를 위한 상급재련(상재) 효율 분석, 재련 루트 추천, 강화 정보를 실시간으로 제공합니다.
          상급재련(상재) 효율 계산기, 재료 시세 기반 골드 효율 비교 도구를 통해 효율적인 재련 전략을 세워보세요.
        </p>
      </footer>

      {/* 모달 컴포넌트 삽입 */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalMaterials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 border-r border-gray-300 dark:border-gray-600">아이템</th>
                  <th className="px-3 py-2 border-r border-gray-300 dark:border-gray-600 text-right">수량</th>
                  <th className="px-3 py-2 text-right">소모 비용</th>
                </tr>
              </thead>
              <tbody>
                {modalMaterials.map((mat, idx) => (
                  <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2 flex items-center gap-2">
                      <img
                        src={mat.name === "평균 소모 골드(누골)" ? "/img/cube/gold.png" : mat.icon}
                        alt={mat.name}
                        className="w-5 h-5"
                      />
                      <span>
                        {mat.name === "운명의 파편 주머니(대)" ? "운명의 파편" : mat.name}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {Number(mat.count).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-yellow-600 dark:text-yellow-400">
                      {Number(mat.total).toLocaleString()} G
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-center text-gray-500">재료 없음</p>
        )}
      </Modal>

    </div>

  );
}
