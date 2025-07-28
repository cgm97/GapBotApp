// app/page.tsx
import MainPages from '@/dom/MainPages';

export const metadata = {
  metadataBase: new URL('https://loagap.com'),  // 실제 도메인 URL
  title: 'LOAGAP | 빈틈봇',
  description: 'LOAGAP(빈틈봇)은 로스트아크 유저를 위한 실시간 유각, 보석, 악세서리, 강화 재료, 생활 재료 시세 및 패키지, 카던, 가디언, 더보기 효율 계산기, 큐브 계산기, 전투정보실 등 다양한 정보를 제공합니다.',
  keywords: '로스트아크, LOAGAP, 빈틈봇, 로아갭, 로아 시세, 실시간 시세, 유각 시세, 보석 시세, 악세서리 시세, 강화 재료, 생활 재료, 전투정보실, 큐브 계산기, 패키지 효율, 카던 효율, 가디언 효율, 더보기 효율',
  openGraph: {
    title: 'LOAGAP | 빈틈봇',
    description: 'LOAGAP(빈틈봇)은 로스트아크 유저를 위한 실시간 유각, 보석, 악세서리, 강화 재료, 생활 재료 시세 및 패키지, 카던, 가디언, 더보기 효율 계산기, 큐브 계산기, 전투정보실 등 다양한 정보를 제공합니다.',
    url: 'https://loagap.com',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: `빈틈 이미지`
      }
    ]

  },
};

export default function Home() {
  return <MainPages />;
}
