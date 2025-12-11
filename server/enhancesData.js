const armor = {
    type: "방어구일반재련",
    tier: 4,
    perLevel: 5,
    level: ["10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19", "19-20", "20-21", "21-22", "22-23", "23-24", "24-25"],
    data: {
        fate_guardian_stone: [3127.90, 3253.00, 6333.70, 7012.30, 13973.90, 16028.90, 23064.80, 25685.80, 28306.80, 57272.60, 62126.20, 104674.90, 111776.40, 115262.90, 123495.90],
        fate_leapstone: [45.90, 54.20, 105.60, 120.60, 246.60, 274.00, 384.40, 401.90, 436.80, 873.60, 938.40, 1461.70, 1583.50, 1646.60, 1829.60],
        abyss_fusion_material: [29.20, 29.20, 67.90, 67.90, 150.70, 150.70, 262.10, 262.10, 262.10, 679.50, 679.50, 990.20, 978.00, 1372.20, 1372.20],
        fate_shard: [12511.50, 13262.20, 34383.00, 37097.40, 72335.50, 77267.50, 125808.10, 135243.70, 143630.90, 310630.90, 331986.70, 514887.30, 536526.90, 559848.30, 590036.20],
        tailoring_flame_11_14: [4.10, 4.10, 7.20, 7.20, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        glacier_breath: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 25.00, 2281.30, 2281.30],
        avg_gold_cost: [
            3236.32, // 4045.40 * 0.8
            3569.99, // 4462.50 * 0.8
            7178.16, // 8972.70 * 0.8
            7962.40, // 9953.00 * 0.8
            16001.52, // 20001.90 * 0.8
            17535.92, // 21919.90 * 0.8
            24602.48, // 30753.10 * 0.8
            26978.88, // 33723.60 * 0.8
            // 18~19부터는 원본 유지
            36868.80,
            74422.00,
            80893.50,
            127778.80,
            135994.70,
            144078.60,
            155056.00
        ],
        // "최종 소모 골드": [16575, 17417, 37927, 40259, 66818, 71227, 111550, 118778, 125971, 275729, 292121, 450318, 474129, 1047981, 1074225],
        // "렙1당 소모골드": [3315, 3483, 7585, 8052, 13364, 14245, 22310, 23756, 25194, 55146, 58424, 90064, 94826, 209596, 214845]
    }
}

const weapon = {
    type: "무기일반재련",
    tier: 4,
    perLevel: 5,
    level: ["10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19", "19-20", "20-21", "21-22", "22-23", "23-24", "24-25"],
    data: {
        fate_destruction_stone: [5213.10, 5421.70, 10556.20, 11687.20, 23289.80, 26714.80, 38441.40, 42809.70, 47178.00, 95454.30, 103543.60, 174458.20, 186294.10, 192104.80, 205826.60],
        fate_leapstone: [75.10, 87.60, 181.00, 203.60, 411.00, 452.10, 629.00, 681.50, 733.90, 1456.10, 1553.20, 2451.80, 2608.10, 2744.40, 2973.10],
        abyss_fusion_material: [50.00, 50.00, 113.10, 113.10, 246.60, 246.60, 436.80, 436.80, 436.80, 1132.50, 1132.50, 1650.30, 1630.10, 2287.00, 2287.00],
        fate_shard: [20852.60, 22103.70, 57304.90, 61829.00, 120559.20, 128779.10, 209680.10, 225406.10, 239384.80, 517718.10, 543279.20, 85814.50, 894211.50, 933080.50, 983393.70],
        metallurgy_flame_11_14: [4.10, 4.10, 7.20, 7.20, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        lava_breath: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 25.00, 73.50, 780.80, 2281.30, 2281.30],
        avg_gold_cost: [
            5404.96,  // 6756.20 * 0.8
            5972.16,  // 7465.20 * 0.8
            12003.84, // 15004.80 * 0.8
            13270.64, // 16588.30 * 0.8
            26632.64, // 33290.80 * 0.8
            29263.04, // 36578.80 * 0.8
            41097.28, // 51371.60 * 0.8
            45011.36, // 56264.20 * 0.8
            // 18~19 부터 원본 유지
            61331.40,
            123928.80,
            134606.70,
            212650.30,
            226813.00,
            240131.00,
            258426.70
        ],
        // total_gold_cost: [32063, 33813, 73249, 79010, 151135, 164494, 252242, 272134, 291482, 624351, 460787, 735037, 1115012, 2295976, 2362531],
        // gold_cost_per_level: [6413, 6763, 14650, 15802, 30227, 32899, 50448, 54427, 58296, 124870, 92157, 147007, 223002, 459195, 472506]
    }
};

const armorAdvanced = {
    type: "방어구상급재련",
    tier: 4,
    perLevel: 10,
    level: ["1-10", "11-20", "21-30", "31-40"],
    data: {
        fate_guardian_stone: [2584, 4651, 53990, 64788],
        fate_leapstone: [62, 82, 972, 1242],
        abyss_fusion_material: [72, 82, 918, 1026],
        fate_shard: [8269, 16538, 377932, 431923],
        glacier_breath: [9, 14, 21, 25],
        tailoring_flame_1_10: [10.35, 0, 0, 0],
        tailoring_flame_10_20: [0, 10.35, 0, 0],
        avg_gold_cost: [13093, 24808, 107981, 129577]
    }
}

const weaponAdvanced = {
    type: "무기상급재련",
    tier: 4,
    perLevel: 10,
    level: ["1-10", "11-20", "21-30", "31-40"],
    data: {
        fate_destruction_stone: [3324, 5685, 64788, 75586],
        fate_leapstone: [88, 113, 1350, 1728],
        abyss_fusion_material: [132, 134, 1512, 1620],
        fate_shard: [14775, 27564, 620889, 701875],
        lava_breath: [0, 14, 21, 25],
        metallurgy_flame_1_10: [11.07, 0, 0, 0],
        metallurgy_flame_10_20: [0, 10.35, 0, 0],
        avg_gold_cost: [16622, 34455, 161971, 215961]
    }
}

const itemNameMap = {
    fate_destruction_stone: '운명의 파괴석',
    fate_guardian_stone: '운명의 수호석',
    fate_leapstone: '운명의 돌파석',
    fate_shard: '운명의 파편 주머니(대)',
    abyss_fusion_material: "아비도스 융화 재료",
    tailoring_flame_11_14: "재봉술 : 업화 [11-14]",
    metallurgy_flame_11_14: "야금술 : 업화 [11-14]",
    tailoring_flame_1_10: "장인의 재봉술 : 1단계",
    tailoring_flame_10_20: "장인의 재봉술 : 2단계",
    metallurgy_flame_1_10: "장인의 야금술 : 1단계",
    metallurgy_flame_10_20: "장인의 야금술 : 2단계",
    glacier_breath: "빙하의 숨결",
    lava_breath: "용암의 숨결",
    avg_gold_cost: "평균 소모 골드(누골)"
};

const calculateEnhance = (enhanceData, marketPrice, Items = []) => {
    const result = [];

    enhanceData.level.forEach((level, index) => {
        let totalCost = 0;

        const materials = Object.keys(enhanceData.data).flatMap((key) => {
            if (key !== 'avg_gold_cost' && !Items.includes("all") && !Items.includes(key)) {
                return [];
            }

            const allMaterials = [...marketPrice.강화재료, ...marketPrice.강화추가재료];
            const materialInfo = allMaterials.find(item => item.name === itemNameMap[key]) ?? {};
            const price = materialInfo.price ?? 0;
            const bundle = materialInfo.bundleCount ?? 1;
            const count = enhanceData.data[key][index] ?? 0;

            let pricePerUnit;
            if (key === "fate_shard") {
                pricePerUnit = price / 3000;
            } else if (key === "avg_gold_cost") {
                pricePerUnit = 1;
            } else {
                pricePerUnit = price / bundle;
            }

            const total = Math.ceil(pricePerUnit * count);
            totalCost += total;

            return [{
                name: itemNameMap[key] || key,
                count,
                pricePerUnit: pricePerUnit.toFixed(3),
                total,
                icon: materialInfo.icon
            }];
        });

        result.push({
            level,
            totalCost,
            perLevelCost: Math.ceil(totalCost / enhanceData.perLevel),
            materials,
        });
    });

    return result;
};

const getSequence = (armorEnhace, armorAdvancedEnhace) => {

    let armorSeqParts = [];

    armorAdvancedEnhace.forEach(({ level: advLevel, perLevelCost: advCost }, i) => {
        const filtered = armorEnhace.filter(({ perLevelCost }) => perLevelCost < advCost);

        if (filtered.length === 0) {
            return;
        }

        const minNormal = filtered.reduce((prev, curr) =>
            prev.perLevelCost > curr.perLevelCost ? prev : curr
        );

        const normalLevelNum = minNormal.level.split("-")[1];

        if (armorSeqParts.includes(normalLevelNum)) {
            armorSeqParts.push(advLevel);
        } else {
            armorSeqParts.push(normalLevelNum);
            armorSeqParts.push(advLevel);
        }
    });

    return armorSeqParts;
}

const calculateTotalCost = (sequence, enhance, enhanceAdvanced) => {

    // 일반강화 비용 계산
    let maxLv = 10; // 최소 레벨
    let sumTotalCost = 0;
    sequence.forEach(seq => {
        if (!seq.includes("-")) {
            if (maxLv < seq) {
                maxLv = seq;
            }
        }
    })

    enhance.forEach(enhance => {
        // 목표레벨 -> maxLv 까지 평균 비용 계산
        const level = enhance.level.split("-")[1];
        if (maxLv >= level) {
            sumTotalCost += enhance.totalCost;
        }
    })

    // 상급재련 비용 합산
    enhanceAdvanced.forEach(enhance => {
        sumTotalCost += enhance.totalCost;
    })

    return sumTotalCost;
}

module.exports = { armor, weapon, armorAdvanced, weaponAdvanced, getSequence, calculateEnhance, calculateTotalCost };