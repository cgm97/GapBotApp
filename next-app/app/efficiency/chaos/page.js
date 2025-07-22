import ChaosPage from './chaosClient';
import AdSense from '@/components/Adsense';

async function getChaosData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/chaos`, {
    next: { revalidate: 10 }, // ISR or SSR
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}

export const metadata = {
  title: '카오스 던전 효율 | LOAGAP',
  description: '로스트아크의 카오스 던전의 1회 보상 실시간 효율 확인해보세요.',
  keywords: '로스트아크, 로아 카던 효율, 카오스 던전 효율, 카던 보상, LOAGAP, 빈틈봇',
  openGraph: {
    title: '카오스 던전 효율 | LOAGAP',
    description: '로스트아크의 카오스 던전의 1회 보상 실시간 효율 확인해보세요.',
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
  const chaosData = await getChaosData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h1 className="dark:text-gray-300">카오스 던전 실시간 효율표</h1>
        <section className="text-sm text-gray-600 dark:text-gray-300 mb-6" aria-label="카오스 던전 효율 안내">
          <p>카오스 던전 클리어시 얻는 아이템의 실시간 단가로 계산된 효율을 확인 할 수 있습니다.</p>
          <p>휴식 게이지 보상은 따로 계산하지 않았으며, 원할시 계산된 효율의 2배로 게산됩니다.</p>
        </section>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <ChaosPage chaosData={chaosData} />
      </div>
    </div>
  );
}