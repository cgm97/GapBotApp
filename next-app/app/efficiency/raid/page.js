import ChaosPage from './raidClient';
import AdSense from '@/components/Adsense';

async function getRaidData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/raid`, {
      next: { revalidate: 1800 },
      headers: {
        referer: "https://loagap.com"
      }, // ISR or SSR // ISR or SSR
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
  title: '레이드 더보기 효율 | LOAGAP',
  description: '로아 더보기 효율 아이템 기준 실시간 시세 기반 골드 효율을 계산합니다. 레이드 더보기 보상만 반영한 효율 계산기입니다.',
  keywords: '로스트아크, 로아, 더보기, 레이드 더보기, 더보기 효율, 로아 더보기 보상, 골드 계산기, 레이드 효율, LOAGAP, 빈틈봇',
  openGraph: {
    title: '레이드 더보기 효율 | LOAGAP',
    description: '로아 더보기 보상 아이템 기준 실시간 시세 기반 골드 효율을 계산합니다. 레이드 더보기 보상만 반영한 효율 계산기입니다.',
    url: 'https://loagap.com/efficiency/raid',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: '레이드 더보기 효율 계산기 이미지',
      }
    ]
  },
};

export default async function Page() {
  const raidData = await getRaidData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold dark:text-gray-300">
        레이드 더보기 실시간 골드 효율 계산기
      </h1>

      <section className="text-sm text-gray-600 dark:text-gray-300 mb-6" aria-label="레이드 더보기 효율 설명">
        <p>
          로스트아크의 <strong>레이드 더보기</strong>를 통해 획득 가능한 <strong>아이템 가격</strong>을 기반으로
          <strong> 실시간 골드 효율</strong>을 계산합니다.
        </p>
        <p>
          특수 재료는 제외되며, <strong>더보기 아이템</strong>만 골드로 환산하여 비교합니다.
        </p>
      </section>
      <div>
        <AdSense adSlot="1488834693" />
      </div>
      <ChaosPage raidData={raidData} />

    </div>
  );
}