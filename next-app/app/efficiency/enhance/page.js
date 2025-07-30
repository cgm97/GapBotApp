import EnhanceClient from './enhanceClient';
import AdSense from '@/components/Adsense';

async function getEnhanceData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/enhance`, {
      method: 'POST',
      next: { revalidate: 10 },
      headers: {
        referer: "https://loagap.com/SSR"
      }, // ISR or SSR
      body: JSON.stringify({ items:["all"] }) // ← JSON body로 데이터 전송
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
  title: '상급 재련 효율 계산기 | 재련 루트 추천 | LOAGAP',
  description: '로스트아크 상급 재련 비용 대비 효율을 실시간 시세로 분석하고, 최적의 재련 루트를 제안하는 계산기입니다.',
  keywords: '로스트아크, 로아 상급 재련, 상급 재련 효율, 재련 루트 추천, 상급재련 계산기, 재련 루트, 로아 재련, 강화 루트, 상재 효율, LOAGAP, 빈틈봇',
  openGraph: {
    title: '상급 재련 효율 계산기 | LOAGAP',
    description: '로스트아크 상급 재련 비용 대비 효율을 실시간 시세로 분석하고, 최적의 재련 루트를 제안하는 계산기입니다.',
    url: 'https://loagap.com/efficiency/enhance',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: '로스트아크 상급재련 효율 계산기'
      }
    ]
  }
};

export default async function Page() {
  const enhanceData = await getEnhanceData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h1 className="text-2xl font-bold dark:text-gray-300">
          로스트아크 상급 재련 효율 계산
        </h1>

        <section className="text-sm text-gray-600 dark:text-gray-300 mb-6" aria-label="상급 재련 효율 안내">
          <p>
            4티어 재련 시 사용되는 <strong>최적 재련 비용</strong>을 기반으로,
            <strong> 일반 재련과 상급 재련의 효율</strong>을 비교해
            <strong> 최적의 강화 루트</strong>를 제공합니다.
          </p>
          <p>
            실시간 시세를 반영하여 <strong>골드 대비 효율적인 강화 구간</strong>을 계산하고,
            <strong> 재련 전략 수립</strong>에 도움을 드립니다.
          </p>
          <p>
            <strong>3티어 재료를 활용한 상급 재련은 1~20단계 구간에서 매우 높은 효율</strong>을 보입니다.
          </p>
        </section>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <EnhanceClient enhanceData={enhanceData} />
      </div>
    </div>
  );
}