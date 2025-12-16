import GuardianPage from './guardianClient';
import AdSense from '@/components/Adsense';

async function getGuardianData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/guardian`, {
      next: { revalidate: 600 },
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
  description: '가토 효율을 실시간 시세 기반으로 확인하세요. 로스트아크 가디언 토벌 1회 보상의 골드 환산 및 구성품 정보 제공.',
  keywords: '로스트아크, 로아, 가디언 토벌, 가토, 가토 보상, 가토 효율, 가토 시세, 가디언 토벌 시세, 로아 골드 효율, 던전 효율 계산기, LOAGAP',
  openGraph: {
    title: '가디언 토벌 효율 | LOAGAP',
    description: '가토 효율을 실시간 시세 기반으로 확인하세요. 로스트아크 가디언 토벌 1회 보상의 골드 환산 및 구성품 정보 제공.',
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
          <p><strong>가디언 토벌(가토)</strong>에서 획득 가능한 보상을 골드로 환산한 <strong>실시간 효율</strong>을 제공합니다.</p>
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