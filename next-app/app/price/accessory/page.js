
import AccessoryPage from './accessoryClient';
import AdSense from '@/components/Adsense';
import sampleData from './data.json';

async function getAccessoryPriceData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/accessory`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) throw new Error('Response not OK');

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('악세서리 시세 불러오기 실패:', err);
    return sampleData;
  }
}

export const metadata = {
  title: '악세시세 · 악세차트 | LOAGAP',
  description: '로스트아크의 실시간 악세서리 시세, 연마 단계별 가격, 상세 차트를 확인하세요.',
  keywords: '로스트아크 악세서리 시세, 고대 악세, 유물 악세, 로아 악세 차트, 연마 단계 시세, 실시간 악세 가격, 로아 악세 시세, LOAGAP, 빈틈봇',
  openGraph: {
    title: '악세시세 · 악세차트 | LOAGAP',
    description: '로스트아크의 실시간 악세서리 시세, 연마 단계별 가격, 상세 차트를 확인하세요.',
    url: 'https://loagap.com/price/accessory',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: '빈틈 이미지'
      }
    ]
  },
};

export default async function Page() {
  const { accessorysPrice, accessoryPriceLastUpdate } = await getAccessoryPriceData();
  return (
    <div className="container-patch">
      <h2>악세시세 / 악세차트</h2>
      <div>
        <AdSense adSlot="1488834693" />
      </div>
      <AccessoryPage accessorysPrice={accessorysPrice} accessoryLastUpdate={accessoryPriceLastUpdate} />
    </div>
  );
}