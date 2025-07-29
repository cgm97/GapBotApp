import EfficiencyPackageClient from './efficiencyPackageClient';
import AdSense from '@/components/Adsense';

async function getMarketsPriceData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/market`, {
      next: { revalidate: 10 },
      headers: {
        referer: "https://loagap.com/SSR"
      },
    });
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
    const res = await fetch(`https://loatool.taeu.kr/api/crystal-history/ohlc/1mon`, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    console.error('API fetch 실패:', e);
    // fallback 데이터 또는 빈 데이터 반환
    return [{ "dt": "2025-07-14T08:55:00", "high": 11001.0, "low": 11001.0, "open": 11001.0, "close": 11001.0 }, { "dt": "2025-07-14T08:56:00", "high": 11001.0, "low": 11001.0, "open": 11001.0, "close": 11001.0 }];
  }
}

async function getJewelsPriceData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/jewel`, {
    next: { revalidate: 60 }, // ISR or SSR
    headers: {
      referer: "https://loagap.com"
    },
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}

export const metadata = {
  title: '패키지 효율 계산기 | LOAGAP',
  description: '로스트아크 크리스탈 패키지의 효율을 계산하고 비교해보세요.',
  keywords: '로스트아크, 로아 패키지 효율, 크리스탈 패키지, 패키지 효율 계산기, 실시간 시세, 골드 환산, 로아 시세 계산기, LOAGAP, 빈틈봇',
  openGraph: {
    title: '패키지 효율 계산기 | LOAGAP',
    description: '로스트아크 크리스탈 패키지의 효율을 계산하고 비교해보세요.',
    url: 'https://loagap.com/efficiency/package',
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
  const [marketData, crystalPrice, jewelsData] = await Promise.all([
    getMarketsPriceData(),
    getCrystalPriceData(),
    getJewelsPriceData()
  ]);
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h1 className="dark:text-gray-300">로스트아크 패키지 효율 계산기</h1>
        <section className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          <p>로스트아크 패키지를 구매하기 전, 효율을 계산해보세요. 패키지 가격을 골드로 환산하고, 실시간 시세를 반영하여 구성품 대비 이득 또는 손해를 확인할 수 있습니다.</p>
          <p><strong>로아 패키지 효율</strong>, <strong>큐브 패키지 계산</strong>, <strong>크리스탈 패키지 계산</strong>, <strong>패키지 환산 골드</strong> 등 다양한 정보를 이 페이지에서 확인할 수 있습니다.</p>
        </section>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <EfficiencyPackageClient marketsPrice={marketData.marketsPrice} marketPriceLastUpdate={marketData.marketPriceLastUpdate} crystalPrice={crystalPrice} jewelsPrice={jewelsData.jewelsPrice} />
      </div>
    </div>
  )
}