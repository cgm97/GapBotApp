const pool = require('./db/connection');
const logger = require('./logger');  // logger.js 임포트
const spec = require('./calculator/specPoint');
const url = 'characterUtil';
const axios = require('axios');

// 공식 API 활용하여 캐릭터 정보 값 파싱 및 조회
const getCharacterProfile = async (nickName) => {
    return await spec.getCharacterProfile(nickName);
}


// 캐릭터 정보 insert
const insertCharacterInfo = async (equipItems, gemItems, accessoryItems, cardItems, engravings, profile, guild, wisdom, arkItems) => {

    const method = 'insertCharacterInfo';

    const connection = await pool.getConnection()
    try {
        if (!profile) {
            throw new Error("profile.NICKNAME이 존재하지 않습니다.");
        }

        // 트랜잭션 시작
        await connection.beginTransaction();

        // DB 연결
        // 로깅
        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `characterUtil info insert: ${profile.NICKNAME}}`,
        });


        // 캐릭터 정보 삽입 SQL
        const charInsertSql = `
            INSERT INTO CHARACTER_INFO (
                NICKNAME, SERVER, JOB, SUBJOB, TITLE, CHARACTER_LEVEL, EXPEDITION_LEVEL, ITEM_LEVEL, ITEM_LEVEL_HISTORY, PVP_GRADE, STATS, IMG_URL
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            ON DUPLICATE KEY UPDATE
                SERVER = VALUES(SERVER),
                JOB = VALUES(JOB),
                SUBJOB = VALUES(SUBJOB),
                TITLE = VALUES(TITLE),
                CHARACTER_LEVEL = VALUES(CHARACTER_LEVEL),
                EXPEDITION_LEVEL = VALUES(EXPEDITION_LEVEL),
                ITEM_LEVEL = VALUES(ITEM_LEVEL),
                ITEM_LEVEL_HISTORY = VALUES(ITEM_LEVEL_HISTORY),
                PVP_GRADE = VALUES(PVP_GRADE),
                STATS = VALUES(STATS),
                IMG_URL = VALUES(IMG_URL),
                LST_DTTI = NOW()
        `;
        // EXPEDITION_CHARACTER = VALUES(EXPEDITION_CHARACTER),
        const nickname = profile.NICKNAME;
        const server = profile.SERVER;
        const job = profile.JOB;
        const subJob = profile.SUBJOB;
        const title = profile.TITLE;
        const level = profile.CHARACTER_LEVEL;
        const expLevel = profile.EXPEDITION_LEVEL;
        const itemLevel = parseFloat(profile.ITEM_LEVEL.replace(/,/g, ''));
        const itemLeveHistory = profile.ITEM_LEVEL_HISTORY;
        const pvpGrade = profile.PVP_GRADE;
        const stats = profile.STATS;
        const imgUrl = profile.IMG_URL;

        const [insertCharInfo] = await connection.execute(charInsertSql, [
            nickname,
            server,
            job,
            subJob,
            title,
            level,
            expLevel,
            itemLevel,
            itemLeveHistory,
            pvpGrade,
            stats,
            imgUrl
        ]);

        // 캐틱터 장비 SQL
        const characterEquipmentSql = `
            INSERT INTO CHARACTER_EQUIPMENT (
                NICKNAME,
                EQUIPMENTS,
                ACCESSORY,
                ENGRAVING
            ) VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                EQUIPMENTS = VALUES(EQUIPMENTS),
                ACCESSORY = VALUES(ACCESSORY),
                ENGRAVING = VALUES(ENGRAVING)
        `;
        const [insertEquip] = await connection.execute(characterEquipmentSql, [
            nickname, equipItems, accessoryItems, engravings
        ]);

        // 캐틱터 길드 SQL
        const characteGuildSql = `
            INSERT INTO CHARACTER_GUILD (
                NICKNAME,
                NAME,
                IS_OWNER
            ) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                NAME = VALUES(NAME),
                IS_OWNER = VALUES(IS_OWNER)
        `;
        const [insertGuild] = await connection.execute(characteGuildSql, [
            nickname, guild.NAME, guild.IS_OWNER
        ]);

        // 캐틱터 영지 SQL
        const characteWisdomSql = `
            INSERT INTO CHARACTER_WISDOM (
                NICKNAME,
                NAME,
                LEVEL
            ) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                NAME = VALUES(NAME),
                LEVEL = VALUES(LEVEL)
        `;
        const [insertWisdom] = await connection.execute(characteWisdomSql, [
            nickname, wisdom.NAME, wisdom.LEVEL
        ]);

        // 캐틱터 보석 SQL
        const characteGemSql = `
            INSERT INTO CHARACTER_JEWELS (
                NICKNAME,
                JEWELS
            ) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                JEWELS = VALUES(JEWELS)
        `;
        const [insertGem] = await connection.execute(characteGemSql, [
            nickname, gemItems
        ]);

        // 캐틱터 카드 SQL
        const characteCardSql = `
            INSERT INTO CHARACTER_CARD (
                NICKNAME,
                NAME,
                CARDS,
                CARD_SETS
            ) VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                NAME = VALUES(NAME),
                CARDS = VALUES(CARDS),
                CARD_SETS = VALUES(CARD_SETS)
        `;
        const [insertCard] = await connection.execute(characteCardSql, [
            nickname, cardItems.name, cardItems.CARDS, cardItems.CARD_SETS
        ]);

        // 캐틱터 앜패 SQL
        const characteArkSql = `
            INSERT INTO CHARACTER_ARKPASSIVE (
                NICKNAME,
                ARK_PASSIVE
            ) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                ARK_PASSIVE = VALUES(ARK_PASSIVE)
        `;
        const [insertArk] = await connection.execute(characteArkSql, [
            nickname, arkItems
        ]);

        // 스킬 
        const kloaCharacter = `https://api.korlark.com/lostark/characters/${nickname}?blocking=true`;
        const responseChar = await axios.get(kloaCharacter);
        const kloaCharacterData = responseChar.data; // 응답 데이터 저장

        // 캐틱터 스킬 SQL
        const characteSkillSql = `
        INSERT INTO CHARACTER_SKILL (
            NICKNAME,
            SKILL_POINT,
            SKILLS
        ) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            SKILL_POINT = VALUES(SKILL_POINT),
            SKILLS = VALUES(SKILLS)
        `;

        const [insertSkill] = await connection.execute(characteSkillSql, [
            nickname, kloaCharacterData.skillPoint, kloaCharacterData.skills
        ]);

        // 내실
        const kloaCollectibles = `https://api.korlark.com/lostark/characters/${nickname}/collectibles`;
        const responseCollect = await axios.get(kloaCollectibles);
        const kloaCollectiblesData = responseCollect.data; // 응답 데이터 저장

        // 캐틱터 스킬 SQL
        const characterCollectSql = `
        INSERT INTO CHARACTER_COLLECTION (
            NICKNAME,
            COLLECTIBLES
        ) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            COLLECTIBLES = VALUES(COLLECTIBLES)
        `;

        const [insertCollect] = await connection.execute(characterCollectSql, [
            nickname, kloaCollectiblesData
        ]);
        
        // 트랜잭션 커밋
        await connection.commit();

        return true; // 쿼리 결과 반환
    } catch (error) {
        logger.error({
            method: method,
            url: url,
            message: `Error inserting character info: ${error.message}`,
        });
        if (connection) {
            await connection.rollback();
        }
        return false; // 실패 시 false 반환
    } finally {
        // 연결 해제
        if (connection) connection.release();
    }
};

module.exports = {
    getCharacterProfile,
    insertCharacterInfo
};