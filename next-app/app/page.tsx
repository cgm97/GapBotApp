// app/page.tsx
import MainPages from '@/dom/MainPages';

export const metadata = {
  metadataBase: new URL('https://loagap.com'),  // 실제 도메인 URL
  title: 'LOAGAP | 빈틈봇',
  description: 'LOAGAP(빈틈봇)은 로스트아크 유저를 위한 실시간 각인서 및 보석 시세, 전투정보실, 큐브 계산기등 제공하는 사이트입니다.',
  keywords: '로스트아크, LOAGAP, 빈틈봇, 유각시세, 보석시세, 전투정보실, 큐브 계산기, 패치노트, 로아갭, LostArk',
  openGraph: {
    title: 'LOAGAP | 빈틈봇',
    description: '전투정보실/각인서/보석 시세 확인부터 큐브 계산기까지, 로스트아크 유저를 위한 LOAGAP!',
    url: 'https://loagap.com',
    type: 'website',
    images: [
        {
          url: '/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
    
  },
};

export default function Home() {
  return <MainPages />;
}
