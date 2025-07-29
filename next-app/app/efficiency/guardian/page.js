import GuardianPage from './guardianClient';
import AdSense from '@/components/Adsense';

async function getGuardianData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/guardian`, {
      next: { revalidate: 10 },
      headers: {
        referer: "https://loagap.com/SSR"
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
  title: '가디언 토벌 효율 | LOAGAP',
  description: '로스트아크 가디언 토벌 1회 보상의 실시간 시세 기반 골드 효율을 확인하세요. 던전별 구성품과 거래 여부 포함.',
  keywords: '로스트아크, 가디언 토벌, 가토 보상, 가토 효율, 가토 시세, 로아 효율, 골드 환산, LOAGAP',
  openGraph: {
    title: '가디언 토벌 효율 | LOAGAP',
    description: '가디언 토벌에서 얻는 보상의 실시간 시세와 골드 효율을 확인해보세요.',
    url: 'https://loagap.com/efficiency/guardian',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: '가디언 토벌 보상 효율',
      }
    ]
  },
};

export default async function Page() {
  const guardianData = await getGuardianData();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container-patch">
        <h1 className="text-2xl font-bold">가디언 토벌 효율</h1>
        <section aria-label="가디언 토벌 보상 설명">
          <p><strong>가디언 토벌</strong>에서 획득 가능한 보상을 골드로 환산한 <strong>실시간 효율</strong>을 제공합니다.</p>
          <p>이 효율은 <em>실시간 시세</em> 기반으로 자동 업데이트됩니다.</p>
        </section>
        <div>
          <AdSense adSlot="1488834693" />
        </div>
        <GuardianPage guardianData={guardianData} />
      </div>
    </div>
  );
}