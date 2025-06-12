export const metadata = {
  title: '재련순위|톡방 | LOAGAP',
  description: '빈틈봇 재련 게임의 랭킹을 확인하세요.',
  keywords: 'LOAGAP, 빈틈봇, 후원, 로스트아크, 로아봇, 군장봇, 군검봇, 유각, 보석, 겁화, 멸화, 작열 ,홍염 유물, 유각시세, 시세, 차트, 유각 차트',
  openGraph: {
    title: '재련순위|톡방 | LOAGAP',
    description: '빈틈봇 재련 게임의 랭킹을 확인하세요.',
    url: 'https://loagap.com/enhance/rank/room',
    type: 'website',
    images: [
        {
          url: 'https://loagap.com/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

import EnhanceClient from './EnhanceClient';

export default async function Page() {
  return <EnhanceClient roomId={null} />;
}