import CharacterPage from './characterClient';

export async function generateMetadata({ params }) {
  const { nickName } = params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/character/search?nickName=${encodeURIComponent(nickName)}`,
      {
        headers: {
          referer: 'loagap.com/meta',
        },
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      return {
        title: '캐릭터 정보를 불러올 수 없습니다 | LOAGAP',
        description: '잘못된 캐릭터 정보입니다.',
      };
    }

    const data = await res.json();

    return {
      title: `${data.profile.NICKNAME} 캐릭터 정보 | LOAGAP`,
      description: `${data.profile.NICKNAME}님의 장비, 보석, 초월, 엘릭서 정보를 확인하세요.`,
      openGraph: {
        title: `${data.profile.TITLE !== "없음" ? data.profile.TITLE : ""} ${data.profile.NICKNAME} 캐릭터 정보 | LOAGAP`,
        description: `${data.profile.SERVER} / ${data.guild.NAME} / Lv.${data.profile.ITEM_LEVEL} / ${data.profile.JOB}·${data.profile.SUBJOB}`,
        url: `https://loagap.com/character/${data.profile.NICKNAME}`,
        images: [
          {
            url: data.profile.IMG_URL,
            width: 300,
            height: 200,
            alt: `${data.profile.NICKNAME}의 이미지`
          }
        ]
      }
    };
  }

export default async function Page({ params }) {
    const { nickName } = await params;
    return <CharacterPage nickName={nickName} />;
  }