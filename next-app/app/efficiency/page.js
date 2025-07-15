import EfficiencyPackageClient from './efficiencyPackageClient';
import AdSense from '@/components/Adsense';

async function getMarketsPriceData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/market`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    console.error('API fetch 실패:', e);
    // fallback 데이터 또는 빈 데이터 반환
    return [{ marketsPrice: {}, marketPriceLastUpdate: null }];
  }
}

async function getCrystalPriceData() {
  try {
    const res = await fetch(`https://loatool.taeu.kr/api/crystal-history/ohlc/1mon`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    console.error('API fetch 실패:', e);
    // fallback 데이터 또는 빈 데이터 반환
    return [{ "dt": "2025-07-14T08:55:00", "high": 11001.0, "low": 11001.0, "open": 11001.0, "close": 11001.0 }, { "dt": "2025-07-14T08:56:00", "high": 11001.0, "low": 11001.0, "open": 11001.0, "close": 11001.0 }];
  }
}

export const metadata = {
  title: '패키지 효율 계산기 | LOAGAP',
  description: '로스트아크 크리스탈 패키지의 효율을 계산하고 비교해보세요.',
  keywords: '로스트아크, 로아 패키지 효율, 크리스탈 패키지, 패키지 효율 계산기, 실시간 시세, 골드 환산, 로아 시세 계산기, LOAGAP, 빈틈봇',
  openGraph: {
    title: '패키지 효율 계산기 | LOAGAP',
    description: '로스트아크 크리스탈 패키지의 효율을 계산하고 비교해보세요.',
    url: 'https://loagap.com/efficiency',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: '로스트아크 패키지 효율 분석 이미지',
      }
    ]
  }
};


export default async function Page() {
  const [marketData, crystalPrice] = await Promise.all([
    getMarketsPriceData(),
    getCrystalPriceData()
  ]);
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h2 className="dark:text-gray-300">로스트아크 패키지 효율 계산기</h2>
        {/* SEO용 숨은 텍스트 영역 (화면에는 안 보임) */}
        <section className="sr-only" aria-label="패키지 효율 계산 키워드">
          <h3>로스트아크 패키지 효율 계산기 주요 키워드</h3>
          <ul>
            <li>로스트아크 패키지 효율</li>
            <li>로아 패키지 효율</li>
            <li>패키지 효율</li>
            <li>패키지 효율 계산</li>
            <li>로아 유료 패키지 비교</li>
          </ul>
        </section>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <EfficiencyPackageClient marketsPrice={marketData.marketsPrice} marketPriceLastUpdate={marketData.marketPriceLastUpdate} crystalPrice={crystalPrice} />
      </div>
    </div>
  )
}