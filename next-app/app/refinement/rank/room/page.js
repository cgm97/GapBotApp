export const metadata = {
  title: '재련순위-마이룸 | LOAGAP',
  description: '빈틈봇 재련순위 - 마이룸',
  keywords: 'LOAGAP, 빈틈봇, 후원, 로스트아크, 로아봇, 군장봇, 군검봇, 유각, 보석, 겁화, 멸화, 작열 ,홍염 유물, 유각시세, 시세, 차트, 유각 차트',
  openGraph: {
    title: '재련순위-내톡방 | LOAGAP',
    description: '빈틈봇 재련순위 - 마이룸',
    url: 'https://loagap.com/refinement/rank/room',
    type: 'website',
    images: [
        {
          url: 'https://loagap.com/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

import RefinementClient from './refinementClient';

export default async function Page() {
  return <RefinementClient roomId={null} />;
}