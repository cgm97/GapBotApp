import EfficiencyPackageClient from './efficiencyPackageClient';
import AdSense from '@/components/Adsense';

async function getMarketsPriceData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/market`, { next: { revalidate: 60 }});
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
    const res = await fetch(`https://loatool.taeu.kr/api/crystal-history/ohlc/1mon`, { next: { revalidate: 60 }});
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    console.error('API fetch 실패:', e);
    // fallback 데이터 또는 빈 데이터 반환
    return [{ "dt": "2025-07-14T08:55:00", "high": 11001.0, "low": 11001.0, "open": 11001.0, "close": 11001.0 }, { "dt": "2025-07-14T08:56:00", "high": 11001.0, "low": 11001.0, "open": 11001.0, "close": 11001.0 }];
  }
}

export const metadata = {
  title: '로스트아크 패키지 효율 계산기 | LOAGAP',
  description: '로스트아크 크리스탈 패키지의 골드 환산 효율을 계산하고 비교해보세요. 실시간 환율과 패키지 구성으로 정확한 효율을 확인할 수 있습니다.',
  keywords: '로스트아크, 로아 패키지 효율, 크리스탈 패키지, 패키지 효율 계산기, 골드 환산, 로아 패키지 가격, LOAGAP, 빈틈봇',
  openGraph: {
    title: '패키지 효율 계산기 | LOAGAP',
    description: '로스트아크 유저를 위한 크리스탈 패키지 효율 분석 도구. 어떤 패키지가 가장 효율적인지 확인해보세요!',
    url: 'https://loagap.com/package/calc',
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
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <EfficiencyPackageClient marketsPrice={marketData.marketsPrice} marketPriceLastUpdate={marketData.marketPriceLastUpdate} crystalPrice={crystalPrice} />
      </div>
    </div>
  )
}