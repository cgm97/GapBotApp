
import MarketPage from './marketClient';
import AdSense from '@/components/Adsense';

async function getMarketsPriceData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/market`, {
    next: { revalidate: 60 }, // ISR or SSR
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}

export const metadata = {
  title: '재련 재료 · 생활 재료 시세 및 차트 | LOAGAP',
  description: '로스트아크 실시간 재련 재료와 생활 재료 시세, 차트, 가격 변동 정보를 빠르게 확인해보세요.',
  keywords: '로스트아크 재련 재료 시세, 강화 재료, 에스더기운, 오레하, 아비도스, 명예의 파편, 운명의 파편, 채집, 낚시, 채광, 고고학, 벌목, LOAGAP',
  openGraph: {
    title: '재련 재료 · 생활 재료 시세 및 차트 | LOAGAP',
    description: '로스트아크 실시간 재련 재료와 생활 재료 시세, 차트, 가격 변동 정보를 빠르게 확인해보세요.',
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
        <h2 className="dark:text-gray-300">재련 재료 / 생활 재료 시세 및 차트</h2>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <MarketPage marketsPrice={marketsPrice} marketPriceLastUpdate={marketPriceLastUpdate} />
      </div>
    </div>
  );
}