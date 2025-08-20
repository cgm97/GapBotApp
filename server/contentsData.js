const chaosRewards = [
  // T3 일반 강화 재료
  // {
  //   itemLevel: 1490,
  //   name: '공허 1단계',
  //   rewards: {
  //     destruction_stone: 100,
  //     guardian_stone: 297,
  //     great_leapstone: 6,
  //     tier3_jewel: 15.48,
  //     honor_shard: 10418,
  //   },
  // },
  // {
  //   itemLevel: 1520,
  //   name: '공허 2단계',
  //   rewards: {
  //     destruction_stone: 119,
  //     guardian_stone: 352.8,
  //     great_leapstone: 8.6,
  //     tier3_jewel: 20.88,
  //     honor_shard: 13502,
  //   },
  // },
  // {
  //   itemLevel: 1540,
  //   name: '절망 1단계',
  //   rewards: {
  //     destruction_stone: 159,
  //     guardian_stone: 449,
  //     great_leapstone: 12,
  //     tier3_jewel: 23,
  //     honor_shard: 16505,
  //   },
  // },
  // {
  //   itemLevel: 1560,
  //   name: '절망 2단계',
  //   rewards: {
  //     destruction_stone: 177,
  //     guardian_stone: 534,
  //     great_leapstone: 14,
  //     tier3_jewel: 23,
  //     honor_shard: 20628,
  //   },
  // },

  // T3 상급 재료
  {
    itemLevel: 1580,
    name: '천공 1단계',
    rewards: {
      refined_destruction_stone: 79,
      refined_guardian_stone: 216.2,
      radiant_leapstone: 6.2,
      tier3_jewel: 10,
      honor_shard: 19913,
    },
  },
  {
    itemLevel: 1600,
    name: '천공 2단계',
    rewards: {
      refined_destruction_stone: 88,
      refined_guardian_stone: 257.1,
      radiant_leapstone: 8.8,
      tier3_jewel: 11,
      honor_shard: 20491,
    },
  },
  {
    itemLevel: 1610,
    name: '계몽 1단계',
    rewards: {
      refined_destruction_stone: 114.7,
      refined_guardian_stone: 326.7,
      radiant_leapstone: 11.9,
      tier3_jewel: 13.8,
      honor_shard: 24313,
    },
  },
  {
    itemLevel: 1630,
    name: '계몽 2단계',
    rewards: {
      refined_destruction_stone: 135.1,
      refined_guardian_stone: 412.1,
      radiant_leapstone: 15.9,
      tier3_jewel: 16.9,
      honor_shard: 26139,
    },
  },

  // T4 구간
  {
    itemLevel: 1640,
    name: '아비도스 1 작전',
    rewards: {
      fate_destruction_stone: 150.6,
      fate_guardian_stone: 458,
      fate_leapstone: 11,
      tier4_jewel: 3,
      fate_shard: 21000,
    },
  },
  {
    itemLevel: 1660,
    name: '아비도스 2 작전',
    rewards: {
      fate_destruction_stone: 185,
      fate_guardian_stone: 522,
      fate_leapstone: 14,
      tier4_jewel: 4,
      fate_shard: 28505,
    },
  },
  {
    itemLevel: 1680,
    name: '아비도스 3 작전',
    rewards: {
      fate_destruction_stone: 222,
      fate_guardian_stone: 640,
      fate_leapstone: 18.2,
      tier4_jewel: 5,
      fate_shard: 31210,
    },
  },
  {
    itemLevel: 1700,
    name: '네프타 1 작전',
    rewards: {
      fate_destruction_stone: 283,
      fate_guardian_stone: 810,
      fate_leapstone: 21.8,
      tier4_jewel: 5.8,
      fate_shard: 33664,
    },
  },
  {
    itemLevel: 1720,
    name: '네프타 2 작전',
    rewards: {
      fate_destruction_stone: 343,
      fate_guardian_stone: 1021,
      fate_leapstone: 27.5,
      tier4_jewel: 6.9,
      fate_shard: 38922,
    },
  },
];

const guardianRewards = [
  // T3 일반
  {
    itemLevel: 1490,
    name: '칼엘리고스',
    rewards: {
      destruction_stone: 75,
      guardian_stone: 226,
      great_leapstone: 10,
    },
  },
  {
    itemLevel: 1540,
    name: '하누마탄',
    rewards: {
      destruction_stone: 101,
      guardian_stone: 306,
      great_leapstone: 14,
    },
  },

  // T3 상급
  {
    itemLevel: 1580,
    name: '소나벨',
    rewards: {
      refined_destruction_stone: 68,
      refined_guardian_stone: 204,
      radiant_leapstone: 8,
    },
  },
  {
    itemLevel: 1610,
    name: '가르가디스',
    rewards: {
      refined_destruction_stone: 103,
      refined_guardian_stone: 301,
      radiant_leapstone: 12,
    },
  },
  {
    itemLevel: 1630,
    name: '베스칼',
    rewards: {
      refined_destruction_stone: 166,
      refined_guardian_stone: 506,
      radiant_leapstone: 24,
    },
  },

  // T4
  {
    itemLevel: 1640,
    name: '아게오로스',
    rewards: {
      fate_destruction_stone: 96.1,
      fate_guardian_stone: 286.5,
      fate_leapstone: 12.4,
    },
  },
  {
    itemLevel: 1680,
    name: '스콜라키아',
    rewards: {
      fate_destruction_stone: 148.4,
      fate_guardian_stone: 450,
      fate_leapstone: 17.6,
    },
  },
  {
    itemLevel: 1700,
    name: '드렉탈라스',
    rewards: {
      fate_destruction_stone: 193.7,
      fate_guardian_stone: 578.5,
      fate_leapstone: 21.5,
    },
  },
    {
    itemLevel: 1720,
    name: '크라티오스',
    rewards: {
      fate_destruction_stone: 353.09,
      fate_guardian_stone: 1108.59,
      fate_leapstone: 35.28,
    },
  },
];

// 레이드보상
const raidRewards = [
  // {
  //   itemLevel: 1415,
  //   name: '발탄',
  //   difficulty: '노말',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 1200,
  //     // gold는 아래 extraRewards로 분리
  //   },
  //   extraRewards: {
  //     gold: 175,
  //   },
  // },
  // {
  //   itemLevel: 1445,
  //   name: '발탄',
  //   difficulty: '하드',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 1800,
  //   },
  //   extraRewards: {
  //     gold: 450,
  //   },
  // },
  // {
  //   itemLevel: 1430,
  //   name: '비아키스',
  //   difficulty: '노말',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 1600,
  //   },
  //   extraRewards: {
  //     gold: 250,
  //   },
  // },
  // {
  //   itemLevel: 1460,
  //   name: '비아키스',
  //   difficulty: '하드',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 2400,
  //   },
  //   extraRewards: {
  //     gold: 600,
  //   },
  // },
  // {
  //   itemLevel: 1475,
  //   name: '쿠크세이튼',
  //   difficulty: '노말',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 3000,
  //   },
  //   extraRewards: {
  //     gold: 450,
  //   },
  // },
  // {
  //   itemLevel: 1490,
  //   name: '아브렐슈드',
  //   difficulty: '노말',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 3000,
  //     week_gold: 1600,
  //     week_gold: 375,
  //   },
  //   extraRewards: {
  //     gold: 450,
  //   },
  // },
  // {
  //   itemLevel: 1540,
  //   name: '아브렐슈드',
  //   difficulty: '하드',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 3600,
  //     week_gold: 2000,
  //     week_gold: 500,
  //   },
  //   extraRewards: {
  //     gold: 900,
  //   },
  // },
  // {
  //   itemLevel: 1540,
  //   name: '카양겔',
  //   difficulty: '노말',
  //   rewards: {
  //     destruction_stone: 0,
  //     guardian_stone: 0,
  //     great_leapstone: 0,
  //     gold: 3300,
  //   },
  //   extraRewards: {
  //     gold: 650,
  //   },
  // },
  // {
  //   itemLevel: 1580,
  //   name: '카양겔',
  //   difficulty: '하드',
  //   rewards: {
  //     refined_destruction_stone: 0,
  //     refined_guardian_stone: 0,
  //     radiant_leapstone: 0,
  //     gold: 4300,
  //   },
  //   extraRewards: {
  //     gold: 1075,
  //   },
  // },
  // {
  //   itemLevel: 1580,
  //   name: '일리아칸',
  //   difficulty: '노말',
  //   rewards: {
  //     refined_destruction_stone: 0,
  //     refined_guardian_stone: 0,
  //     radiant_leapstone: 0,
  //     gold: 4700,
  //   },
  //   extraRewards: {
  //     gold: 750,
  //   },
  // },
  // {
  //   itemLevel: 1600,
  //   name: '일리아칸',
  //   difficulty: '하드',
  //   rewards: {
  //     refined_destruction_stone: 0,
  //     refined_guardian_stone: 0,
  //     radiant_leapstone: 0,
  //     gold: 6000,
  //   },
  //   extraRewards: {
  //     gold: 1500,
  //   },
  // },
  // {
  //   itemLevel: 1600,
  //   name: '상아탑',
  //   difficulty: '노말',
  //   rewards: {
  //     refined_destruction_stone: 0,
  //     refined_guardian_stone: 0,
  //     radiant_leapstone: 0,
  //     gold: 5200,
  //   },
  //   extraRewards: {
  //     gold: 700,
  //   },
  // },
  // {
  //   itemLevel: 1620,
  //   name: '상아탑',
  //   difficulty: '하드',
  //   rewards: {
  //     refined_destruction_stone: 0,
  //     refined_guardian_stone: 0,
  //     radiant_leapstone: 0,
  //     gold: 7200,
  //   },
  //   extraRewards: {
  //     gold: 720,
  //   },
  // },
  {
    itemLevel: 1610,
    name: '카멘',
    difficulty: '노말',
    rewards: {
      refined_destruction_stone: 555,
      refined_guardian_stone: 1110,
      radiant_leapstone: 16,
      honor_shard: 11250,
      gold: 6400
    },
    extraRewards: {
      refined_destruction_stone: 930,
      refined_guardian_stone: 1860,
      radiant_leapstone: 34,
      honor_shard: 8880,
      gold: 1440,
    },
  },
  {
    itemLevel: 1630,
    name: '카멘',
    difficulty: '하드',
    rewards: {
      refined_destruction_stone: 1140,
      refined_guardian_stone: 2280,
      radiant_leapstone: 19,
      honor_shard: 18300,
      gold: 13000
    },
    extraRewards: {
      refined_destruction_stone: 1570,
      refined_guardian_stone: 3140,
      radiant_leapstone: 59,
      honor_shard: 15770,
      gold: 3250
    },
  },
  {
    itemLevel: 1620,
    name: '에키드나',
    difficulty: '노말',
    rewards: {
      refined_destruction_stone: 570,
      refined_guardian_stone: 1140,
      radiant_leapstone: 11,
      honor_shard: 11700,
      gold: 7300,
    },
    extraRewards: {
      refined_destruction_stone: 850,
      refined_guardian_stone: 1700,
      radiant_leapstone: 32,
      honor_shard: 10690,
      gold: 1220,
    },
  },
  {
    itemLevel: 1640,
    name: '에키드나',
    difficulty: '하드',
    rewards: {
      fate_destruction_stone: 460,
      fate_guardian_stone: 920,
      fate_leapstone: 5,
      fate_shard: 6500,
      gold: 8800
    },
    extraRewards: {
      fate_destruction_stone: 770,
      fate_guardian_stone: 1540,
      fate_leapstone: 19,
      fate_shard: 5170,
      gold: 2880
    },
  },
  {
    itemLevel: 1640,
    name: '베히모스',
    difficulty: '노말',
    rewards: {
      fate_destruction_stone: 480,
      fate_guardian_stone: 960,
      fate_leapstone: 5,
      fate_shard: 7000,
      gold: 8800,
    },
    extraRewards: {
      fate_destruction_stone: 770,
      fate_guardian_stone: 1540,
      fate_leapstone: 19,
      fate_shard: 5170,
      gold: 2880,
    },
  },
  {
    itemLevel: 1660,
    name: '1막 에기르',
    difficulty: '노말',
    rewards: {
      fate_destruction_stone: 1060,
      fate_guardian_stone: 2120,
      fate_leapstone: 9,
      fate_shard: 8000,
      gold: 15500
    },
    extraRewards: {
      fate_destruction_stone: 1030,
      fate_guardian_stone: 2060,
      fate_leapstone: 29,
      fate_shard: 9810,
      gold: 3430
    },
  },
  {
    itemLevel: 1680,
    name: '1막 에기르',
    difficulty: '하드',
    rewards: {
      fate_destruction_stone: 1240,
      fate_guardian_stone: 2480,
      fate_leapstone: 13,
      fate_shard: 9600,
      gold: 24500
    },
    extraRewards: {
      fate_destruction_stone: 1790,
      fate_guardian_stone: 3580,
      fate_leapstone: 59,
      fate_shard: 16490,
      gold: 9520
    },
  },
  {
    itemLevel: 1670,
    name: '2막 아브렐슈드',
    difficulty: '노말',
    rewards: {
      fate_destruction_stone: 1180,
      fate_guardian_stone: 2360,
      fate_leapstone: 5,
      fate_shard: 8600,
      gold: 21500
    },
    extraRewards: {
      fate_destruction_stone: 1600,
      fate_guardian_stone: 3200,
      fate_leapstone: 42,
      fate_shard: 15050,
      gold: 8070
    },
  },
  {
    itemLevel: 1690,
    name: '2막 아브렐슈드',
    difficulty: '하드',
    rewards: {
      fate_destruction_stone: 1340,
      fate_guardian_stone: 2680,
      fate_leapstone: 15,
      fate_shard: 10600,
      gold: 30500
    },
    extraRewards: {
      fate_destruction_stone: 2350,
      fate_guardian_stone: 4700,
      fate_leapstone: 80,
      fate_shard: 22000,
      gold: 11700
    },
  },
  {
    itemLevel: 1680,
    name: '3막 모르둠',
    difficulty: '노말',
    rewards: {
      fate_destruction_stone: 1240,
      fate_guardian_stone: 2480,
      fate_leapstone: 14,
      fate_shard: 9800,
      gold: 28000
    },
    extraRewards: {
      fate_destruction_stone: 1960,
      fate_guardian_stone: 3920,
      fate_leapstone: 64,
      fate_shard: 17800,
      gold: 9800
    },
  },
  {
    itemLevel: 1700,
    name: '3막 모르둠',
    difficulty: '하드',
    rewards: {
      fate_destruction_stone: 1600,
      fate_guardian_stone: 3200,
      fate_leapstone: 20,
      fate_shard: 13000,
      gold: 38000
    },
    extraRewards: {
      fate_destruction_stone: 4050,
      fate_guardian_stone: 8100,
      fate_leapstone: 131,
      fate_shard: 33700,
      gold: 12600
    },
  },

  {
    itemLevel: 1700,
    name: '4막 파멸의 성채',
    difficulty: '노말',
    rewards: {
      fate_destruction_stone: 1780,
      fate_guardian_stone: 3560,
      fate_leapstone: 21,
      fate_shard: 12200,
      gold: 33000
    },
    extraRewards: {
      fate_destruction_stone: 3800,
      fate_guardian_stone: 7600,
      fate_leapstone: 122,
      fate_shard: 32040,
      gold: 10500
    },
  },

  {
    itemLevel: 1720,
    name: '4막 파멸의 성채',
    difficulty: '하드',
    rewards: {
      fate_destruction_stone: 2130,
      fate_guardian_stone: 4260,
      fate_leapstone: 27,
      fate_shard: 15400,
      gold: 42000
    },
    extraRewards: {
      fate_destruction_stone: 4560,
      fate_guardian_stone: 9120,
      fate_leapstone: 147,
      fate_shard: 38450,
      gold: 13440
    },
  },

    {
    itemLevel: 1710,
    name: '종막 최후의 날',
    difficulty: '노말',
    rewards: {
      fate_destruction_stone: 1980,
      fate_guardian_stone: 3960,
      fate_leapstone: 27,
      fate_shard: 14100,
      gold: 40000
    },
    extraRewards: {
      fate_destruction_stone: 4370,
      fate_guardian_stone: 8740,
      fate_leapstone: 140,
      fate_shard: 36850,
      gold: 12800
    },
  },

    {
    itemLevel: 1730,
    name: '종막 최후의 날',
    difficulty: '하드',
    rewards: {
      fate_destruction_stone: 2550,
      fate_guardian_stone: 5100,
      fate_leapstone: 38,
      fate_shard: 18400,
      gold: 52000
    },
    extraRewards: {
      fate_destruction_stone: 6000,
      fate_guardian_stone: 12000,
      fate_leapstone: 190,
      fate_shard: 47300,
      gold: 16640
    },
  },

    {
    itemLevel: 1740,
    name: '종막 최후의 날',
    difficulty: '더퍼스트',
    rewards: {
      fate_destruction_stone: 0,
      fate_guardian_stone: 0,
      fate_leapstone: 0,
      fate_shard: 0,
      gold: 52000
    },
    extraRewards: {
      fate_destruction_stone: 0,
      fate_guardian_stone: 0,
      fate_leapstone: 0,
      fate_shard: 0,
      gold: 0
    },
  },
];


const itemNameMap = {
  destruction_stone: '파괴강석',
  guardian_stone: '수호강석',
  great_leapstone: '경이로운 명예의 돌파석',
  refined_destruction_stone: '정제된 파괴강석',
  refined_guardian_stone: '정제된 수호강석',
  radiant_leapstone: '찬란한 명예의 돌파석',
  fate_destruction_stone: '운명의 파괴석',
  fate_guardian_stone: '운명의 수호석',
  fate_leapstone: '운명의 돌파석',
  honor_shard: '명예의 파편 주머니(대)',
  fate_shard: '운명의 파편 주머니(대)',
  tier3_jewel: '1레벨 보석',
  tier4_jewel: '1레벨 보석'
};

const chaosResults = (marketPrice, jewelPrice) => {
  const chaosGold = [];

  chaosRewards.forEach(chaos => {
    let canSellPrice = 0;
    let cantSellPrice = 0;
    let isTradeable = true;

    const mappedRewards = Object.entries(chaos.rewards).map(([key, count]) => {
      let unitPrice = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.price ?? 0;
      let unitBundle = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.bundleCount ?? 1;
      let icon = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.icon ?? '';

      if (key === "honor_shard") {
        unitPrice = unitPrice / 1500;
      }
      if (key === "fate_shard") {
        unitPrice = unitPrice / 3000;
      }
      if (key === "tier3_jewel") {
        unitPrice = 15; // 고정값
        icon = "https://loagap.com/img/cube/jewellery3.png"
      }
      if (key === "tier4_jewel") {
        unitPrice = jewelPrice?.['1']?.[1]?.price || jewelPrice?.['1']?.[0]?.price || 130;
        icon = "https://loagap.com/img/cube/jewellery4.png"
      }

      const price = (unitPrice / unitBundle * count);
      if (key.includes("destruction") || key.includes("guardian") || key.includes("jewel")) {
        canSellPrice += price;
        isTradeable = true;
      } else {
        cantSellPrice += price;
        isTradeable = false;
      }

      return {
        key,
        name: itemNameMap[key] ?? key,
        count,
        price: Number(price.toFixed(0)),
        isTradeable,
        icon
      };
    });

    chaosGold.push({
      itemLevel: chaos.itemLevel,
      name: chaos.name,
      tradeablePrice: Number(canSellPrice.toFixed(0)),
      nonTradeablePrice: Number(cantSellPrice.toFixed(0)),
      totalPrice: Number((canSellPrice + cantSellPrice).toFixed(0)),
      rewards: mappedRewards, // rewards = mappedRewards, 기존 rewards 제거
    });
  });

  return chaosGold;
};

const guardianResults = (marketPrice) => {

  const guardianGold = [];

  guardianRewards.forEach(guardian => {
    let totalPrice = 0;

    const mappedRewards = Object.entries(guardian.rewards).map(([key, count]) => {
      const itemInfo = marketPrice.강화재료.find(item => item.name === itemNameMap[key]) || {};
      let icon = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.icon ?? '';
      const unitPrice = itemInfo.price ?? 0;
      const unitBundle = itemInfo.bundleCount ?? 1;
      const price = unitPrice / unitBundle * count;

      totalPrice += price;

      return {
        key,
        name: itemNameMap[key] ?? key,
        count,
        price: Number(price.toFixed(0)),
        isTradeable: true,
        icon
      };
    });

    guardianGold.push({
      itemLevel: guardian.itemLevel,
      name: guardian.name,
      totalPrice: Number(totalPrice.toFixed(0)),
      rewards: mappedRewards, // rewards = mappedRewards, 기존 rewards 제거
    });
  });

  return guardianGold;
}

const raidResults = (marketPrice) => {

  const raidGold = [];

  raidRewards.forEach(raid => {


    let basicTotalPrice = 0;
    let extraTotalPrice = 0;

    const basicRewards = Object.entries(raid.rewards).map(([key, count]) => {
      let unitPrice = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.price ?? 0;
      let unitBundle = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.bundleCount ?? 1;
      let icon = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.icon ?? 'https://loagap.com/img/cube/gold.png';

      if (key === "honor_shard") {
        unitPrice = unitPrice / 1500;
      }
      if (key === "fate_shard") {
        unitPrice = unitPrice / 3000;
      }

      const price = (unitPrice / unitBundle * count);
      basicTotalPrice += price;

      return {
        key,
        name: itemNameMap[key] ?? key,
        count,
        price: Number(price.toFixed(0)),
        icon
      };
    });

    const extraRewards = Object.entries(raid.extraRewards).map(([key, count]) => {
      let unitPrice = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.price ?? 0;
      let unitBundle = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.bundleCount ?? 1;
      let icon = marketPrice.강화재료.find(item => item.name === itemNameMap[key])?.icon ?? 'https://loagap.com/img/cube/gold.png';

      if (key === "honor_shard") {
        unitPrice = unitPrice / 1500;
      }
      if (key === "fate_shard") {
        unitPrice = unitPrice / 3000;
      }

      const price = (unitPrice / unitBundle * count);
      extraTotalPrice += price;

      return {
        key,
        name: itemNameMap[key] ?? key,
        count,
        price: Number(price.toFixed(0)),
        icon
      };
    });

    raidGold.push({
      itemLevel: raid.itemLevel,
      name: raid.name,
      difficulty: raid.difficulty,
      rewards: basicRewards,
      extraRewards: extraRewards,
      totalPrice: Number(basicTotalPrice.toFixed(0)),
      extraTotalPrice: Number(extraTotalPrice.toFixed(0)),
    });
  });

  return raidGold;
}

module.exports = { chaosResults, guardianResults, raidResults };