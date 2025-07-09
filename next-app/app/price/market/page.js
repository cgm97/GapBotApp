
import MarketPage from './marketClient';
import AdSense from '@/components/Adsense';

async function getMarketsPriceData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/market`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    console.error('API fetch 실패:', e);
    // fallback 데이터 또는 빈 데이터 반환
    return { marketsPrice: {}, marketPriceLastUpdate: null };
  }
}

export const metadata = {
  title: '로스트아크 재련 · 생활 재료 시세 차트 - 실시간 가격 | LOAGAP',
  description: '로스트아크 강화 재련 재료, 생활 재료(벌목, 채광, 낚시, 고고학 등)의 실시간 시세와 가격 변동 차트를 확인하세요. 에스더 기운, 오레하 융화 재료, 명예의 파편, 아비도스 등 주요 재료 LOAGAP에서 한눈에!',
  keywords: '로스트아크 재련 재료 시세, 로아 강화 재료 가격, 로아 생활 재료 시세, 벌목 시세, 채광 시세, 고고학 시세, 낚시 시세, 명예의 파편 가격, 오레하 융화 재료, 에스더 기운, 로아 재료 차트, 아비도스, LOAGAP',
  openGraph: {
    title: '로스트아크 재련 · 생활 재료 시세 차트 - 실시간 가격 | LOAGAP',
    description: '로스트아크 강화 재련 재료, 생활 재료(벌목, 채광, 낚시, 고고학 등)의 실시간 시세와 가격 변동 차트를 확인하세요. 에스더 기운, 오레하 융화 재료, 명예의 파편, 아비도스 등 주요 재료 LOAGAP에서 한눈에!',
    url: 'https://loagap.com/price/market',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: '빈틈 이미지'
      }
    ]
  }
};

export default async function Page() {
  const { marketsPrice, marketPriceLastUpdate } = await getMarketsPriceData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h2 className="dark:text-gray-300">강화 재련 재료 / 생활 재료 시세 및 차트</h2>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <MarketPage marketsPrice={marketsPrice} marketPriceLastUpdate={marketPriceLastUpdate} />
      </div>
    </div>
  );
}