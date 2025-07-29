import ChaosPage from './chaosClient';
import AdSense from '@/components/Adsense';
import axios from 'axios';

async function getChaosData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/chaos`, {
      next: { revalidate: 10 },
      headers: {
        referer: "https://loagap.com/SSR"
      }, // ISR or SSR
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    console.error('API fetch 실패:', e);
    // fallback 데이터 또는 빈 데이터 반환
    return [];
  }
}

export const metadata = {
  title: '카오스 던전 효율 | LOAGAP',
  description: '로스트아크 카오스 던전 1회 보상 효율을 실시간 시세 기반으로 분석해보세요. 골드 환산, 아이템 가치, 효율 비교 제공.',
  keywords: '로스트아크, 카오스 던전, 카던 효율, 카던 보상, 카던 시세, 카오스 효율 계산기, 로아 골드 효율, LOAGAP',
  openGraph: {
    title: '카오스 던전 효율 | LOAGAP',
    description: '로스트아크 카오스 던전 1회 보상 효율을 실시간 시세 기반으로 분석해보세요. 골드 환산, 아이템 가치, 효율 비교 제공.',
    url: 'https://loagap.com/efficiency/chaos',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: `빈틈 이미지`
      }
    ]
  },
};

export default async function Page() {
  const chaosData = await getChaosData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h1 className="text-xl font-bold dark:text-gray-300">
          로스트아크 카오스 던전 효율 (실시간 시세 기반)
        </h1>
        <section className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          <p>
            로스트아크 카오스 던전 1회 보상으로 획득할 수 있는 아이템을 실시간 시세 기준으로 분석하여
            <strong> 골드 효율 </strong>을 계산합니다.
          </p>
          <p>
            휴식 게이지 보상은 별도로 계산되지 않으며, 평균적으로 <strong>2배 효율</strong>로 추정됩니다.
          </p>
        </section>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <ChaosPage chaosData={chaosData} />
      </div>
    </div>
  );
}