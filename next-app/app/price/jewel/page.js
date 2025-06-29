
import JewelPage from './jewelClient';
import AdSense from '@/components/Adsense';

async function getJewelsPriceData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/jewel`, {
    next: { revalidate: 60 }, // ISR or SSR
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}

export const metadata = {
  title: '보석시세 · 보석차트 | LOAGAP',
  description: '로스트아크의 실시간 1~10레벨 보석시세, 차트, 가격 변동, 랭킹 정보를 빠르게 확인해보세요.',
  keywords: '로스트아크 보석 시세, 로아 보석 가격, 겁화 보석, 작열 보석, 정화 보석, 로아 보석 차트, 로아 보석 시세, LOAGAP',
  openGraph: {
    title: '보석시세 · 보석차트 | LOAGAP',
    description: '로스트아크의 실시간 1~10레벨 보석시세, 차트, 가격 변동, 랭킹 정보를 빠르게 확인해보세요.',
    url: 'https://loagap.com/price/jewel',
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
  const { jewelsPrice, jewelPriceLastUpdate } = await getJewelsPriceData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h2 className="dark:text-gray-300">보석시세 / 보석차트</h2>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <JewelPage jewelsPrice={jewelsPrice} jewelPriceLastUpdate={jewelPriceLastUpdate} />
      </div>
    </div>
  );
}