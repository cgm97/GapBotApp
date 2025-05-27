
import JewelPage from './jewelClient';

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
  keywords: 'LOAGAP, 빈틈봇, 겁화시세, 작열시세, 보석시세, 보석차트, 보석가격, 보석랭킹, 보석순위, 겁화, 작열, 멸화, 홍염, 로스트아크, 로아, 보석',
  openGraph: {
    title: '보석시세 · 보석차트 | LOAGAP',
    description: '로스트아크의 실시간  1~10레벨 보석시세, 차트, 가격 변동, 랭킹 정보를 빠르게 확인해보세요.',
    url: 'https://loagap.com/price/jewel',
    type: 'website',
  },
};

export default async function Page() {
  const { jewelsPrice, jewelPriceLastUpdate } = await getJewelsPriceData();

  return (
    <div className="container-patch">
      <h2>보석시세 / 보석차트</h2>
      <JewelPage jewelsPrice={jewelsPrice} jewelPriceLastUpdate={jewelPriceLastUpdate} />
    </div>
  );
}