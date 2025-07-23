import ChaosPage from './raidClient';
import AdSense from '@/components/Adsense';

async function getRaidData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/raid`, {
      next: { revalidate: 10 },
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
  title: '더보기 효율 | LOAGAP',
  description: '로스트아크의 레이드 더보기 실시간 효율 확인해보세요.',
  keywords: '로스트아크, 로아 레이드 더보기, 더보기 효율, 더보기 보상, LOAGAP, 빈틈봇',
  openGraph: {
    title: '더보기 효율 | LOAGAP',
    description: '로스트아크의 레이드 더보기 실시간 효율 확인해보세요.',
    url: 'https://loagap.com/price/book',
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
  const raidData = await getRaidData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <h1 className="dark:text-gray-300">레이드 실시간 더보기 효율표</h1>
      <section className="text-sm text-gray-600 dark:text-gray-300 mb-6" aria-label="레이드 더보기 효율 안내">
        <p>레이드 더보기시 얻는 아이템의 실시간 단가로 계산된 효율을 확인 할 수 있습니다.</p>
        <p>특수 재료는 제외됩니다. 오직 더보기 아이템 단가로 계산됩니다.</p>
      </section>
      <div>
        <AdSense adSlot="1488834693" />
      </div>
      <ChaosPage raidData={raidData} />

    </div>
  );
}