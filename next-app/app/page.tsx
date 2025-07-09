// app/page.tsx
import MainPages from '@/dom/MainPages';

export const metadata = {
  metadataBase: new URL('https://loagap.com'),  // 실제 도메인 URL
  title: 'LOAGAP | 빈틈봇',
  description: 'LOAGAP(빈틈봇)은 로스트아크 유저를 위한 실시간 유각 시세, 보석 시세, 악세서리 시세, 강화 재련 및 생활재료 가격, 차트, 전투정보실, 큐브 계산기 등 다양한 게임 정보를 한눈에 제공합니다.',
  keywords: '로스트아크, LOAGAP, 빈틈봇, 유각 시세, 보석 시세, 악세서리 시세, 강화 재련, 생활재료 시세, 전투정보실, 큐브 계산기, 로아 시세, 실시간 시세, Lost Ark',
  openGraph: {
    title: 'LOAGAP | 빈틈봇',
    description: 'LOAGAP(빈틈봇)은 로스트아크 유저를 위한 실시간 유각 시세, 보석 시세, 악세서리 시세, 강화 재련 및 생활재료 가격, 차트, 전투정보실, 큐브 계산기 등 다양한 게임 정보를 한눈에 제공합니다.',
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
